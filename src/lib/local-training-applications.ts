import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  buildTrainingApplicationPayload,
  type ApplicationApprovalStatus,
  type ApplicationAttemptStatus,
  type ApplicationCrossCheckStatus,
  type ApplicationPaymentStatus,
  type TrainingApplicationRecord,
} from "@/lib/training-application";

type LocalTrainingApplicationStore = {
  version: 1;
  applications: TrainingApplicationRecord[];
};

type CreateLocalTrainingApplicationInput = {
  serviceName: string;
  applicationDate: string;
  candidateName: string;
  guardianName: string;
  email: string;
  gender: "male" | "female";
  dateOfBirth: string;
  addressLine: string;
  mandal: string;
  district: string;
  state: string;
  pinCode: string;
  phone: string;
  residencePhone: string;
  educationQualification: string;
  occupation: string;
  sponsoringOrganization: string;
  photoName: string;
  photoType: string;
  photoUrl: string;
  photoObjectKey: string;
};

type UpdateLocalTrainingApplicationInput = {
  attemptStatus: ApplicationAttemptStatus;
  paymentStatus: ApplicationPaymentStatus;
  approvalStatus: ApplicationApprovalStatus;
  crossCheckStatus: ApplicationCrossCheckStatus;
  adminNotes: string;
  paymentReference: string;
};

const localStorePath = path.join(process.cwd(), ".local-data", "training-applications.json");
const emptyStore: LocalTrainingApplicationStore = {
  version: 1,
  applications: [],
};

let localStoreWriteQueue = Promise.resolve();

async function ensureLocalStore() {
  await mkdir(path.dirname(localStorePath), { recursive: true });
}

async function readStore() {
  await ensureLocalStore();

  try {
    const raw = await readFile(localStorePath, "utf8");
    const parsed = JSON.parse(raw) as LocalTrainingApplicationStore;
    if (parsed?.version === 1 && Array.isArray(parsed.applications)) {
      return parsed;
    }
  } catch {
    return emptyStore;
  }

  return emptyStore;
}

async function writeStore(store: LocalTrainingApplicationStore) {
  await ensureLocalStore();
  await writeFile(localStorePath, JSON.stringify(store, null, 2), "utf8");
}

async function withStoreMutation<T>(
  mutate: (store: LocalTrainingApplicationStore) => T | Promise<T>,
) {
  const run = async () => {
    const store = await readStore();
    const result = await mutate(store);
    await writeStore(store);
    return result;
  };

  const current = localStoreWriteQueue.then(run, run);
  localStoreWriteQueue = current.then(
    () => undefined,
    () => undefined,
  );
  return current;
}

export async function getLocalTrainingApplications() {
  const store = await readStore();
  return [...store.applications].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function createLocalTrainingApplication(input: CreateLocalTrainingApplicationInput) {
  return withStoreMutation((store) => {
    const now = new Date().toISOString();
    const id = `local-app-${randomUUID()}`;
    const payload = buildTrainingApplicationPayload(input);
    const record: TrainingApplicationRecord = {
      id,
      createdAt: now,
      updatedAt: now,
      name: input.candidateName,
      email: input.email || "no-email-provided@applicant.local",
      phone: input.phone,
      latestPayment: null,
      payload,
    };

    store.applications.unshift(record);
    return record;
  });
}

export async function updateLocalTrainingApplication(
  id: string,
  input: UpdateLocalTrainingApplicationInput,
) {
  return withStoreMutation((store) => {
    const index = store.applications.findIndex((application) => application.id === id);
    if (index === -1) {
      return null;
    }

    const current = store.applications[index];
    const approvedAt =
      input.approvalStatus === "APPROVED"
        ? current.payload.approvedAt || new Date().toISOString()
        : input.approvalStatus === "REJECTED"
          ? null
          : current.payload.approvedAt;
    const approvedBy =
      input.approvalStatus === "APPROVED"
        ? current.payload.approvedBy || "Local Admin"
        : input.approvalStatus === "REJECTED"
          ? null
          : current.payload.approvedBy;
    const updatedAt = new Date().toISOString();
    const updated: TrainingApplicationRecord = {
      ...current,
      updatedAt,
      payload: {
        ...current.payload,
        attemptStatus: input.attemptStatus,
        paymentStatus: input.paymentStatus,
        approvalStatus: input.approvalStatus,
        crossCheckStatus: input.crossCheckStatus,
        adminNotes: input.adminNotes || "",
        paymentReference: input.paymentReference || "",
        approvedAt,
        approvedBy,
      },
    };

    store.applications[index] = updated;
    return updated;
  });
}
