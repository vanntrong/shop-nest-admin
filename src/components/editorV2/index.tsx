/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
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
      onChange={(event, editor) => {
        // @ts-ignore
        const data = editor.getData();

        onChange?.(data);
      }}
    />
  );
};

export default EditorV2;
