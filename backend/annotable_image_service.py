"""File upload to S3 handler using Flask."""

from io import StringIO

import boto3
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import base64


app = Flask(__name__)
CORS(app)

BUCKET_NAME = 'informatics-webimages'

@app.route("/", methods=["GET"])
def hello():
    """/ says hello world"""
    return "hello world"

@app.route("/upload", methods=["POST"])
def upload_file():
    """Upload a file to S3."""
    if request.method == "POST":
        # request.get_data()
        # print(f'Request: {request}')
        # print(f'Request.data: {request.data}')
        # print(f'Request.form: {request.form}')
        # print(f'Request.json: {request.json}')
        # print(f'Request.files: {request.files}')
        fs = request.get_json(force=True)
        # print(fs.mimetype)
        fn = 'annotable/'+secure_filename(fs['content_name'])

        sfs = boto3.resource("s3")
        bucket = sfs.Bucket(BUCKET_NAME)
        # upload file with native filename
        s3obj = bucket.Object(fn)

        binary_data = fs['data']
        if "base64" in fs['mime_type']:
            binary_data = base64.b64decode(fs['data'])

        s3obj.put(Body=binary_data, ContentType=fs['mime_type'])
        # update latest file for annotable webapp
        copy_source = {
            'Bucket': BUCKET_NAME,
            'Key': fn
        }
        bucket.copy(copy_source, 'annotable/latest')

        return f'Uploaded to s3://{bucket.name}/{fn}\ns3://{bucket.name}/annotable/latest updated'


def is_base64(data):
    pass

if __name__ == '__main__':
    app.run()
