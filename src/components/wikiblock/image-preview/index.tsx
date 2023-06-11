import { shortedName } from '@/utils/helper';
import { Avatar, Modal } from 'antd';
import React, { FC, useState } from 'react';

interface Props {
  src?: string;
  alt?: string;
  text: string;
  size?: 'small' | 'large' | 'default';
  shape?: 'square' | 'circle';
}

const ImagePreview: FC<Props> = ({ src, alt, text, size = 'default', shape }) => {
  const [visibleImagePreview, setVisibleImagePreview] = useState<boolean>(false);

  return (
    <>
      <Avatar src={src} onClick={() => setVisibleImagePreview(true)} alt={alt} size={size} shape={shape}>
        {shortedName(text)}
      </Avatar>
      <Modal
        visible={visibleImagePreview}
        title={text}
        footer={null}
        onCancel={() => setVisibleImagePreview(false)}
        width={300}
      >
        <div className="w-full h-full flex items-center justify-center">
          <img alt={alt} className="w-full object-contain" src={src} />
        </div>
      </Modal>
    </>
  );
};

export default ImagePreview;
