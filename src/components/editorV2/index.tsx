import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

interface EditorV2Props {
  data?: string;
  onChange?: (data: string) => void;
}

const EditorV2 = ({ data, onChange }: EditorV2Props) => {
  return (
    <CKEditor
      editor={Editor}
      data={data}
      onReady={editor => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();

        onChange?.(data);
      }}
    />
  );
};

export default EditorV2;
