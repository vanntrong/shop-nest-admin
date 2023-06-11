import { CloseOutlined } from '@ant-design/icons';
import { FC } from 'react';
import './index.less';

interface Props {
  url: string;
  onRemove: (key: string) => void;
}

const PreviewUpload: FC<Props> = ({ url, onRemove }) => {
  return (
    <div className="preview-upload">
      <img src={url} alt="" className="w-full h-full max-w-[104px] max-h-[104px] object-cover" />
      <div className="preview-upload-icon" onClick={() => onRemove(url)}>
        <CloseOutlined color="white" size={32} />
      </div>
    </div>
  );
};

export default PreviewUpload;
