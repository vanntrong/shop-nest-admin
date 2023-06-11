import { Modal, message, UploadProps, Upload, Form } from 'antd';
import { FC, useCallback, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { UploadFile, RcFile } from 'antd/es/upload';

interface Props {
  name: string;
  multiple?: boolean;
}

const uploadProps: UploadProps = {
  name: 'file',
  action: import.meta.env.VITE_API_UPLOAD_IMAGE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },

  listType: 'picture-card',
};
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const getFile = (e: any, multiple = false) => {
  if (Array.isArray(e)) {
    return e;
  }

  const files: UploadFile[] = e.fileList;
  const fileUrls = [];

  for (const i in files) {
    if (!multiple) {
      return files[i].response?.url;
    }
    fileUrls.push(files[i].response?.url);
  }

  return fileUrls;
};

export const WikiUploadImage: FC<Props> = ({ name, multiple = false }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleOnChange = useCallback(
    (info: any) => {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file && info.file.response && info.file.response.url) {
          setFileUrl(info.file.response.url);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    [fileUrl],
  );

  return (
    <>
      <Form.Item name={name} getValueFromEvent={e => getFile(e, multiple)}>
        <Upload {...uploadProps} onChange={handleOnChange} onPreview={handlePreview}>
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
        <Modal visible={previewOpen} footer={null} onCancel={handleCancel}>
          <img alt="image" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Form.Item>
    </>
  );
};
