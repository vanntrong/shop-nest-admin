import { Button, Modal, Space, Tag, Input } from 'antd';
import React, { FC, useState } from 'react';

export type Tag = {
  value: string;
  label: string;
  checked: boolean;
};

interface Props {
  tags: Array<Tag>;
  searchTags?: Array<Tag>;
  onChange: (tag: string, checked: boolean) => void;
  onSearchTagsChange?: (tag: string, checked: boolean, label: string) => void;
  onSearchInputChange?: (value: string) => void;
  onOk?: () => void;
}

const { CheckableTag } = Tag;
const { Search } = Input;

const ContentTag: FC<Props> = ({ tags, onChange, searchTags, onSearchInputChange, onSearchTagsChange }) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const handleChange = (tag: string, checked: boolean) => {
    onChange(tag, checked);
  };

  const onCloseModal = () => setIsShowModal(false);

  return (
    <React.Fragment>
      <Space wrap>
        {tags.map(tag => (
          <CheckableTag key={tag.value} checked={tag.checked} onChange={checked => handleChange(tag.value, checked)}>
            {tag.label}
          </CheckableTag>
        ))}
        <Button
          size="small"
          onClick={() => {
            setIsShowModal(true);
          }}
        >
          <span className="text-[12px]">Add New</span>
        </Button>
      </Space>
      <Modal title={'Add New Tag'} visible={isShowModal} onCancel={onCloseModal} closable onOk={onCloseModal}>
        <Search placeholder="Search for new tag" onChange={e => onSearchInputChange?.(e.target.value)} />
        {searchTags && (
          <Space style={{ marginTop: 20 }} wrap>
            {searchTags.map(tag => (
              <CheckableTag
                key={tag.value}
                checked={tag.checked}
                onChange={checked => onSearchTagsChange?.(tag.value, checked, tag.label)}
              >
                {tag.label}
              </CheckableTag>
            ))}
          </Space>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ContentTag;
