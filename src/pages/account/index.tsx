import { getMeApi, updateMeApi } from '@/api/account.api';
import { Button, DatePicker as D, DatePickerProps, Form, Input, Select, Upload } from 'antd';
import { omit } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser as setUserLocal } from '@/stores/user.store';

const { Option } = Select;

type Field = {
  name: string;
  label: string;
  rules?: any[];
  textArea?: boolean;
  select?: boolean;
  datePicker?: boolean;
  items?: any[];
  extraText?: string;
};
const DatePicker = D as any;
const accountFormFields: Array<Field> = [
  {
    label: 'Full name',
    name: 'full_name',
    rules: [{ required: true, message: 'Full name is required' }],
  },
  // {
  //   label: 'Email',
  //   name: 'email',
  //   rules: [{ required: true, message: 'Email is required' }],
  // },
  // {
  //   label: 'Phone',
  //   name: 'phone',
  //   rules: [],
  // },
  {
    label: 'Gender',
    name: 'gender',
    select: true,
    items: [
      {
        value: 'male',
        label: 'Male',
      },
      {
        value: 'female',
        label: 'Female',
      },
      {
        value: 'other',
        label: 'Other',
      },
    ],
    rules: [],
  },
  {
    label: 'Dob',
    name: 'dob',
    datePicker: true,
    rules: [],
  },
  // {
  //   label: 'About',
  //   name: 'about',
  //   textArea: true,
  //   extraText: 'Tell us a little about yourself',
  //   rules: [],
  // },
];

const AccountPage = () => {
  const [user, setUser] = useState<any>();
  const [date, setDate] = useState<string>();
  const [avatar] = useState<string>();
  const [gender, setGender] = useState<'male' | 'female' | 'other'>();
  const dispatch = useDispatch();

  const fetch = async () => {
    const res = await getMeApi();

    setUser(res);
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (user && user.dob) {
      setDate(user.dob);
    }
  }, [user]);

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDate(dateString);
  };

  const handleSaveChangeProfile = async (values: any) => {
    if (date) {
      values.dob = date;
    }
    if (avatar) {
      values.picture = avatar;
    }
    if (gender) {
      values.gender = gender;
    }
    const res = (await updateMeApi(values)) as any;

    setUser(res);
    dispatch(setUserLocal(res));
  };

  return (
    <div>
      <div className="p-3 lg:p-6 mt-[-24px]">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          maxCount={1}
          accept=".png, .jpg, .jpeg"
          headers={{
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }}
          action="https://api-dev.cryptolistening.io/v1/upload/images"
        >
          <div>
            <img src="" alt="" className="w-full" />
          </div>
        </Upload>
        {user && (
          <Form onFinish={handleSaveChangeProfile} initialValues={omit(user, ['id', 'roles', 'avatar'])}>
            {accountFormFields.map((field, index) =>
              field.datePicker ? (
                <div key={index} className="mb-[20px] flex items-center">
                  <div className="mb-0 text-secondary text-sm w-[120px]">{field.label}:</div>
                  <div className="flex-1">
                    <DatePicker onChange={onChange} style={{ width: '150px' }} />
                  </div>
                </div>
              ) : field.select ? (
                <div key={index} className="mb-[20px] flex items-center">
                  <div className="mb-0 text-secondary text-sm w-[120px]">{field.label}:</div>
                  <div className="flex-1">
                    <Select style={{ width: '150px' }} onChange={value => setGender(value)}>
                      {field.items?.map((item, index) => (
                        <Option key={index} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              ) : field.textArea ? (
                <div key={index} className="mb-[20px]">
                  <div className="flex items-center">
                    <div className="mb-0 text-secondary text-sm w-32 w-[120px]">{field.label}:</div>
                    <div className="flex-1">
                      <Form.Item name={field.name} rules={field.rules} style={{ marginBottom: 0 }}>
                        <Input.TextArea maxLength={5000} autoSize={{ minRows: 4 }} />
                      </Form.Item>
                      {field.extraText && <div className="text-[#ADADAD] text-xs mt-2">{field.extraText}</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={index} className="mb-[20px]">
                  <div className="flex items-center">
                    <div className="mb-0 text-secondary text-sm  w-[120px]">{field.label}:</div>
                    <div className="flex-1">
                      <Form.Item name={field.name} rules={field.rules} style={{ marginBottom: 0 }}>
                        <Input className="w-full" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ),
            )}
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit" className="mt-8">
                Save
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
