const PDFServicesSdk = require("@adobe/pdfservices-node-sdk");

const PDF_SERVICES_CLIENT_ID = "394bfed19edf4c148b09ced56e9e5c8a";
const PDF_SERVICES_CLIENT_SECRET = "p8e-6mZDFhmscFslaLCLUZfgUmWQksX-enKF";

async function createPdfFromClient(filePath, originalname) {
  // If our output already exists, remove it so we can run the application again.
  // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  //   const INPUT = "./Bodea Brochure.pdf";
  /* PDF FROM DOCX */
  try { 
    const credentials =
      PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
        .withClientId(PDF_SERVICES_CLIENT_ID)
        .withClientSecret(PDF_SERVICES_CLIENT_SECRET)
        .build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext =
        PDFServicesSdk.ExecutionContext.create(credentials),
      createPdfOperation = PDFServicesSdk.CreatePDF.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFServicesSdk.FileRef.createFromLocalFile(filePath);
    createPdfOperation.setInput(input);

    //Generating a file name
    let outputFilePath = await createOutputFilePath();

    // Execute the operation and Save the result to the specified location.
    await createPdfOperation
      .execute(executionContext)
      .then(async (result) => {
        await result.saveAsFile(outputFilePath);
      })
      .catch((err) => {
        if (
          err instanceof PDFServicesSdk.Error.ServiceApiError ||
          err instanceof PDFServicesSdk.Error.ServiceUsageError
        ) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });

    //Generates a string containing a directory structure and file name for the output file.
    async function createOutputFilePath() {
      let date = new Date();
      let dateString =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        "T" +
        ("0" + date.getHours()).slice(-2) +
        "-" +
        ("0" + date.getMinutes()).slice(-2) +
        "-" +
        ("0" + date.getSeconds()).slice(-2);
      return "temp/" + dateString + "-" + originalname.split(".")[0] + ".pdf";
    }

    return outputFilePath;
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
}

module.exports = { createPdfFromClient };
