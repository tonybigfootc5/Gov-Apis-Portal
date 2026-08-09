export const contactFaqCategories = [
  {
    category: "Enrollment",
    questions: [
      {
        question: "How do I enroll for a training program?",
        answer: "Open Programs, choose the training, fill the application form, review the details, and complete the online payment.",
      },
      {
        question: "When is my enrollment confirmed?",
        answer: "Enrollment is confirmed automatically after the payment gateway marks the transaction successful.",
      },
      {
        question: "Do I need admin approval after payment?",
        answer: "No. Successful gateway payment automatically enrolls the student into the selected program.",
      },
      {
        question: "Can I enroll if a program says Coming soon?",
        answer: "No. Coming soon means the batch date is not fixed yet. Contact 93955077066 for the next update.",
      },
      {
        question: "What details are required in the application?",
        answer: "Applicant name, Aadhaar number, date of birth, gender, address, phone number, education details, selected program, and applicant photo are required.",
      },
      {
        question: "Can I edit details after submitting?",
        answer: "For corrections after payment, contact the center with your invoice number, enrollment ID, and registered mobile number.",
      },
      {
        question: "Where can I see my enrollment ID?",
        answer: "The enrollment ID appears on the successful payment confirmation card after the gateway confirms payment.",
      },
    ],
  },
  {
    category: "Payments & Receipt",
    questions: [
      {
        question: "What should I do after payment?",
        answer: "Wait for the success page. It shows the PhonePe transaction ID, invoice number, amount, program, and enrollment ID.",
      },
      {
        question: "What if my payment fails or expires?",
        answer: "Failed or expired payments do not enroll the student. Start the application payment again or contact the center if money was debited.",
      },
      {
        question: "Where can I find my receipt?",
        answer: "The successful payment page has a Download Successful Card button with a QR code for verification.",
      },
      {
        question: "Is an invoice number generated for failed payments too?",
        answer: "Yes. Every payment attempt gets an invoice number so the admin can search and trace the transaction.",
      },
      {
        question: "Which transaction ID should I keep?",
        answer: "Keep the PhonePe transaction ID shown on the success page, along with the invoice number and enrollment ID.",
      },
      {
        question: "What if money is debited but the page shows failed or pending?",
        answer: "Contact the center with your invoice number, PhonePe transaction details, registered mobile number, and program name.",
      },
      {
        question: "Can the QR code verify my receipt?",
        answer: "Yes. The downloaded success card includes a QR code that admin can scan to read the receipt details.",
      },
    ],
  },
  {
    category: "Training & Facilities",
    questions: [
      {
        question: "Will I get a certificate on completion?",
        answer: "Yes. A physical certificate is issued after successful completion of the training program.",
      },
      {
        question: "Are refreshments included?",
        answer: "Yes. Refreshments are included for enrolled trainees during the training schedule.",
      },
      {
        question: "Is paid accommodation provided?",
        answer: "Yes. Paid accommodation can be provided for trainees who need to stay during the program, subject to room availability.",
      },
      {
        question: "What is the room price for accommodation?",
        answer: "The room price is Rs. 500 per day, excluding GST. Food charges are extra.",
      },
      {
        question: "Is food included with the accommodation room price?",
        answer: "No. The Rs. 500 per day room price excludes GST and does not include food. Food is charged separately.",
      },
      {
        question: "Are seats limited?",
        answer: "Yes. Each program has limited seats, and enrollment is accepted only while seats and batch registration are available.",
      },
      {
        question: "Is the training practical or only classroom-based?",
        answer: "The programs include practical training, demonstrations, field-led learning, and classroom grounding depending on the course.",
      },
      {
        question: "What language is used during training?",
        answer: "Training is generally conducted in English and Telugu, with support based on the batch group.",
      },
      {
        question: "Who can attend the training?",
        answer: "Farmers, rural youth, women, existing beekeepers, entrepreneurs, agriculture workers, and interested learners can apply.",
      },
      {
        question: "Do I need previous beekeeping experience?",
        answer: "Scientific Beekeeping is beginner friendly. Advanced programs such as Queen Bee and Royal Jelly training are better for learners with hive experience.",
      },
      {
        question: "Will tools or equipment be shown during training?",
        answer: "Yes. Relevant hive tools, bee boxes, extractors, processing tools, and practical equipment are introduced based on the course.",
      },
    ],
  },
  {
    category: "Batches & Location",
    questions: [
      {
        question: "Where is the training conducted?",
        answer: "Training is conducted at the API CULTURE Technology Center facilities in Rajendranagar, Hyderabad.",
      },
      {
        question: "When does enrollment close?",
        answer: "Enrollment closes automatically at 12:00 AM on the batch start date.",
      },
      {
        question: "Are Honey Processing and Queen Bee batches always available?",
        answer: "No. These batches are opened manually by admin only when a batch date is fixed.",
      },
      {
        question: "What time does training usually run?",
        answer: "Training hours are normally 10:00 AM to 5:00 PM unless the center announces a different schedule for a specific batch.",
      },
      {
        question: "How do I know the next batch date?",
        answer: "The program page shows the next batch date when it is available. If it says Coming soon, the date has not been fixed.",
      },
      {
        question: "Can I pay on the batch start date?",
        answer: "No. Online enrollment closes automatically at 12:00 AM on the batch start date.",
      },
      {
        question: "How do I contact the center for location help?",
        answer: "Use the phone numbers in the Contact section or open the map link for the listed Rajendranagar office.",
      },
      {
        question: "Will I be informed if a batch is changed?",
        answer: "The center will use the registered contact details when a batch update needs to be communicated.",
      },
    ],
  },
] as const;
