const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const VideoDefinition = grpc.loadPackageDefinition(
  protoLoader.loadSync(path.resolve(__dirname, "./video.proto"))
);

const serverAddress = "localhost:50051";
const videoClient = new VideoDefinition.VideoService(
  serverAddress,
  grpc.credentials.createInsecure()
);

videoClient.GetVideoContent({}).on("data", function (chunk) {
  console.log(chunk.contentStream);
});
