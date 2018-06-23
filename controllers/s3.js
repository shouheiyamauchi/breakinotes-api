const aws = require('aws-sdk');

aws.config.region = process.env.S3_REGION;
const S3_BUCKET = process.env.S3_BUCKET;

const s3 = new aws.S3();

module.exports = {
  urlWithToken: (req, res) => {
    const fileName = req.body.fileName;
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName
    };
    s3.getSignedUrl('getObject', s3Params, (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    });
  },
  signedUrl: (req, res) => {
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'private'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) return res.status(500).send(err);
      const returnData = {
        signedRequest: data,
        url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName
      };
      res.status(200).send(returnData);
    });
  },
  delete: (req, res) => {
    const fileName = req.body.fileName;
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName
    };

    s3.deleteObject(s3Params, (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(fileName + ' was deleted');
    });
  }
};
