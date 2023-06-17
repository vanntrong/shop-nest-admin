function uploadAdapter(loader, editor) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        loader.file.then(file => {
          const data = new FormData();

          data.append('file', file);
          fetch('http://localhost:8080/api/v1/upload', {
            body: data,
            method: 'POST',
            headers: {
              // Authorization:
              //   'Bearer ' +
              //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxODQ2Mjk3LWMyMmItNGY0MS1hNjNlLTA2OTdlN2E2ZmE5YiIsIm5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlX2lkIjoiNDdmYmYzZjYtNzllOS00MTQ4LTliYTQtOTc0Y2ZhZGFiZTc1IiwibGFuZ3VhZ2UiOiJ2aSIsImlhdCI6MTY2MTQyNTM3MSwiZXhwIjoxNjYxNTExNzcxfQ.x8tGF1FkFi8ktxXmWdQYLfA8i5QXuUyPUmSjiWpWrZw',
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(res => res.json())
            .then(res => {
              editor.model.change(writer => {
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
export function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return uploadAdapter(loader, editor);
  };
}
