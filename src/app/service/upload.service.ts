import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk/global';
// import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }
  
  uploadFile(file) {
    const contentType = file.type;
    // const bucket = new S3(
    //       {
    //         accessKeyId: environment.AWS_ACCESS_KEY_ID,
    //         secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    //         region: environment.AWS_REGION
    //       }
    //   );
    //   const params = {
    //       Bucket: environment.AWS_BUCKET_NAME,
    //       Key: file.name,
    //       Body: file,
    //       ACL: 'public-read',
    //       ContentType: contentType
    //   };
    //   bucket.upload(params, function (err, data) {
    //       if (err) {
    //           console.log('There was an error uploading your file: ', err);
    //           return false;
    //       }
    //       console.log('Successfully uploaded file.', data);
    //       return true;
    //   });
//for upload progress   
/*bucket.upload(params).on('httpUploadProgress', function (evt) {
          console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      }).send(function (err, data) {
          if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
      });*/
}
}
