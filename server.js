const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const fs = require("fs");

const PROTO_PATH = path.resolve(__dirname, "./video.proto");
const VideoDefinition = grpc.loadPackageDefinition(
  protoLoader.loadSync(PROTO_PATH)
);

function getVideoContent(call) {
  const videoDataStream = fs.createReadStream("./video.mp4");
  videoDataStream.on("data", chunk => {
    console.log(chunk);
    call.write({ contentStream: chunk });
  });

  videoDataStream.on("end", () => {
    call.end();
  });
}

const server = new grpc.Server();

server.addService(VideoDefinition.VideoService.service, {
  GetVideoContent: getVideoContent,
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);
