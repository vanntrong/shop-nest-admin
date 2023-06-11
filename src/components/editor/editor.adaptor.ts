import { FileApi } from '@/api/file';

function uploadAdapter(loader: any, editor: any) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        loader.file.then((file: any) => {
          const data = new FormData();

          data.append('file', file);
          FileApi.upload({
            data,
            method: 'post',
            url: 'https://api.cryptolistening.io/v1/upload/images',
            config: {
              headers: {
                Authorization:
                  'Bearer ' +
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxODQ2Mjk3LWMyMmItNGY0MS1hNjNlLTA2OTdlN2E2ZmE5YiIsIm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlX2lkIjoiNDdmYmYzZjYtNzllOS00MTQ4LTliYTQtOTc0Y2ZhZGFiZTc1IiwibGFuZ3VhZ2UiOiJ2aSIsImlhdCI6MTY2MTQyNTM3MSwiZXhwIjoxNjYxNTExNzcxfQ.x8tGF1FkFi8ktxXmWdQYLfA8i5QXuUyPUmSjiWpWrZw',
                'Content-Type': 'multipart/form-data',
              },
            },
          })
            .then((res: any) => {
              editor.model.change((writer: any) => {
                writer.setSelection(editor.model.document.getRoot(), 'end');
              });
              resolve({
                default: res.url,
              });
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    },
  };
}
export function uploadPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return uploadAdapter(loader, editor);
  };
}
