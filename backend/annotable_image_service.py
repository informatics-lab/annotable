"""File upload to S3 handler using Flask."""

from io import StringIO

import boto3
from flask import Flask, request
# import s3fs
from werkzeug.utils import secure_filename


app = Flask(__name__)

BUCKET_NAME = 'informatics-webimages'

@app.route("/", methods=["GET"])
def hello():
    """/ says hello world"""
    return "hello world"

@app.route("/upload", methods=["POST"])
def upload_file():
    """Upload a file to S3."""
    if request.method == "POST":
        fs = request.files['user_file']
        print(type(fs))
        print(fs.mimetype)
        fn = 'annotable/'+secure_filename(fs.filename)

        sfs = boto3.resource("s3")
        bucket = sfs.Bucket(BUCKET_NAME)
        s3obj = bucket.Object(fn)
        s3obj.put(Body=fs.read(), ContentType=fs.content_type)

        return f'Uploaded to s3://{bucket.name}/{fn}'

if __name__ == '__main__':
    app.run()
