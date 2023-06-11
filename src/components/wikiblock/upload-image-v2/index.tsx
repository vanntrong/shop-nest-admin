import { message, Upload } from 'antd';
import React, { FC } from 'react';
import PreviewUpload from '../preview-upload';
import { PlusOutlined } from '@ant-design/icons';
import { getBase64, getFileSize } from '@/utils/helper';
import { ShowUploadListInterface } from 'antd/lib/upload/interface';

interface Props {
  multiple?: boolean;
  accept?: string;
  fileList?: any[];
  showUploadList?: boolean | ShowUploadListInterface;
  onRemoveItem: (key: string) => void;
  onChange: (file: any) => void;
  limit?: number;
  limitSize?: number;
}

export const uploadImage = async (options: any) => {
  const { onSuccess, onProgress } = options;

  setTimeout(() => {
    onSuccess('ok');
    onProgress({ percent: 100 });
  }, 200);
};

const WikiUploadImage: FC<Props> = ({
  multiple = false,
  accept = 'image/*',
  fileList = [],
  onRemoveItem,
  showUploadList = false,
  onChange,
  limit,
  limitSize,
}) => {
  const handleChange = async (info: any) => {
    if (limit && fileList.length >= limit) {
      message.error(`Limit upload ${limit} images`);

      return;
    }

    try {
      const { file } = info;

      const fileSize = getFileSize(file.size);

      if (limitSize && fileSize > limitSize) {
        message.error(`Limit upload file ${limit} mb`);

        return;
      }

      const fileBase64 = (await getBase64(file.originFileObj)) as string;

      onChange(fileBase64);
    } catch (error) {
      message.error('Upload image error');
    }
  };

  return (
    <Upload
      action="/upload"
      listType="picture-card"
      customRequest={uploadImage}
      multiple={multiple}
      onChange={handleChange}
      fileList={fileList}
      accept={accept}
      showUploadList={showUploadList}
      itemRender={(originNode, file) => {
        const fileString = file as unknown as string;

        return <PreviewUpload url={fileString} key={`banner-${Math.random()}`} onRemove={key => onRemoveItem(key)} />;
      }}
    >
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    </Upload>
  );
};

export default WikiUploadImage;
