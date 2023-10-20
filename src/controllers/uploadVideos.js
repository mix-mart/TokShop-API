
const Product = require("../models/productSchema");
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, ContainerSASPermissions, BlobSASPermissions } = require("@azure/storage-blob");

// const connectionString = "DefaultEndpointsProtocol=https;AccountName=auctionzone;AccountKey=easuk7Ao0ZErdoB3aYSROSXeEFXA8hQ92/kSOVIpjY4j/M6EJR1AZaRE1W9sMUxK3gMRr3QWJOq4+AStsgbHvg==;EndpointSuffix=core.windows.net";
const containerName = "auctoinvideos";

const accountName = 'auctionzone';
const accountKey = 'easuk7Ao0ZErdoB3aYSROSXeEFXA8hQ92/kSOVIpjY4j/M6EJR1AZaRE1W9sMUxK3gMRr3QWJOq4+AStsgbHvg==';

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);


exports.uploadVideo = async (req, res) => {
  try {
    // Upload video to Azure Blob Storage
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(req.file.originalname);

    // Upload the video to Azure Blob Storage
    
    const cleanBuffer = (buffer) => {
      return Buffer.from(buffer.toString('binary'), 'binary');
    };

    await blockBlobClient.upload(cleanBuffer(req.file.buffer), req.file.buffer.length, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    // Generate a SAS token for the uploaded video
    const containerSAS = generateBlobSASQueryParameters(
      {
        containerName: containerName,
        permissions: ContainerSASPermissions.parse("racwd"), // Adjust permissions as needed
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 86400 * 7 * 1000), // Extend the expiry time by 7 days (in milliseconds)
        
      },
      sharedKeyCredential // This is the shared key credential
    );
    
    // Now, you can append the generated SAS token to the video URL to provide access.
    const videoUrlWithSAS = `${blockBlobClient.url}?${containerSAS.toString()}`;
  
    const existingProduct = await Product.findById(req.body.productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product's video details
    existingProduct.videoUrlWithSAS = videoUrlWithSAS;
    existingProduct.blobName = blockBlobClient.name;

    // Save the updated product to the database
    await existingProduct.save();
  
  
    res.status(201).json({ message: "File uploaded successfully", videoUrl: videoUrlWithSAS ,blobName:blockBlobClient.name,expiresOn:containerSAS.expiresOn});
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Error while uploading video" });
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    // Delete video from Azure Blob Storage
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(req.params.blobName);
    const existingProduct = await Product.findById(req.body.productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await blockBlobClient.delete();

    // Update the product's video details
    existingProduct.videoUrlWithSAS = null;
    existingProduct.blobName = null;

    // Save the updated product to the database
    await existingProduct.save();
  

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Error while deleting video" });
  }
};
