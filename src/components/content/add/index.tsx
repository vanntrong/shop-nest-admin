import { apiSearchCategory } from '@/api/category.api';
import { apiSearchCoin } from '@/api/coin.api';
import { apiSearchCompany } from '@/api/company.api';
import { apiChangeStatusContentItem } from '@/api/content.api';
import { apiSearchEvent } from '@/api/event.api';
import { apiSearchPerson } from '@/api/person.api';
import { apiSearchProduct } from '@/api/product.api';
import ContentTag, { Tag } from '@/components/content/Tag';
import { Editor } from '@/components/editor';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { RequestParams } from '@/interface';
import { Category } from '@/interface/category/category.interface';
import { Coin } from '@/interface/coin/coin.interface';
import { Company } from '@/interface/company/company.interface';
import { Content, ContentStatus } from '@/interface/content/content.interface';
import { Event } from '@/interface/event.interface';
import { Person } from '@/interface/person/person.interface';
import { Product } from '@/interface/product/product.interface';
import store from '@/stores';
import { Button, Form, Input, message, Space, Switch, Typography } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { marked } from 'marked';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const { Title } = Typography;

const { TextArea } = Input;

const LIMIT_FILE_PHOTOS = 5;
const LIMIT_FILE_SIZE = 5;

interface Props {
  newsData?: Content;
  onFinish?: (values: any) => void;
  onReset?: () => void;
  isEdit?: boolean;
}

const ContentAdd: FC<Props> = ({ newsData, onFinish, isEdit = false }) => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState(newsData?.languageCode || 'en');
  const [categoryTags, setCategoryTags] = useState<Array<Tag>>([]);
  const [companyTags, setCompanyTags] = useState<Array<Tag>>([]);
  const [cryptoAssetsTags, setCryptoAssetsTags] = useState<Array<Tag>>([]);
  const [productTags, setProductTags] = useState<Array<Tag>>([]);
  const [personTags, setPersonTags] = useState<Array<Tag>>([]);
  const [eventTags, setEventTags] = useState<Array<Tag>>([]);
  const [status, setStatus] = useState<ContentStatus>(newsData?.status || ContentStatus.PROCESSING);
  const [isBlocking, setIsBlocking] = useState(false);
  const [content, setContent] = useState(marked.parse(newsData?.content || ''));
  const [photos, setPhotos] = useState<Array<string>>([]);
  const user = store.getState().user;

  const [categoriesSearchTags, setCategoriesSearchTags] = useState<Array<Tag>>([]);
  const [companySearchTags, setCompanySearchTags] = useState<Array<Tag>>([]);
  const [cryptoAssetsSearchTags, setCryptoAssetsSearchTags] = useState<Array<Tag>>([]);
  const [productSearchTags, setProductSearchTags] = useState<Array<Tag>>([]);
  const [personSearchTags, setPersonsSearchTags] = useState<Array<Tag>>([]);
  const [eventSearchTags, setEventSearchTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    const languageParams = searchParams.get('language');

    if (languageParams) {
      setLanguage(languageParams);
    }
    setIsBlocking(true);
  }, []);

  useEffect(() => {
    if (newsData) {
      const {
        categories = [],
        company_tags = [],
        coin_tags = [],
        product_tags = [],
        person_tags = [],
        event_tags = [],
        photos = [],
      } = newsData;

      setCategoryTags(
        categories
          ?.sort((a, b) => b.weight - a.weight)
          .map(cate => ({ value: cate.id, label: cate.title, checked: true })) || [],
      );

      setCompanyTags(company_tags.map(cate => ({ value: cate.id, label: cate.name, checked: true })) || []);
      setCryptoAssetsTags(coin_tags.map(cate => ({ value: cate.id, label: cate.name, checked: true })) || []);
      setProductTags(product_tags.map(cate => ({ value: cate.id, label: cate.name, checked: true })) || []);
      setPersonTags(person_tags.map(cate => ({ value: cate.id, label: cate.name, checked: true })) || []);
      setEventTags(event_tags?.map(cate => ({ value: cate.id, label: cate.name, checked: true })) || []);
      setPhotos(photos);
      form.setFieldsValue(newsData);
    }
  }, [newsData]);

  const handleChangeLanguage = (value: string) => {
    if (language === value) return;
    if (isBlocking) {
      const isConfirm = window.confirm('Are you sure to change language?, all data will be lost');

      if (!isConfirm) return;
    }
    window.open(!isEdit ? `/content/add?language=${value}` : `/content/${newsData?.id}?language=${value}`, '_blank');
  };

  const handleFormChange = () => {
    updateIsBlocking();
  };

  const handleFinish = (values: any) => {
    values.categories = categoryTags.filter(cate => cate.checked).map(cate => cate.value);
    values.company_tags = companyTags.filter(cate => cate.checked).map(cate => cate.value);
    values.coin_tags = cryptoAssetsTags.filter(cate => cate.checked).map(cate => cate.value);
    values.product_tags = productTags.filter(cate => cate.checked).map(cate => cate.value);
    values.person_tags = personTags.filter(cate => cate.checked).map(cate => cate.value);
    values.event_tags = eventTags.filter(cate => cate.checked).map(cate => cate.value);
    values.content = NodeHtmlMarkdown.translate(content);
    onFinish?.({ ...values, photos });
  };

  const updateIsBlocking = () => {
    if (!isBlocking) setIsBlocking(true);
    else return;
  };

  const onCategoryTagsChange = (tag: string, checked: boolean) => {
    setCategoryTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const onCompanyTagsChange = (tag: string, checked: boolean) => {
    setCompanyTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const onCryptoAssetsTagsChange = (tag: string, checked: boolean) => {
    setCryptoAssetsTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const onProductTagsChange = (tag: string, checked: boolean) => {
    setProductTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const onPeopleTagsChange = (tag: string, checked: boolean) => {
    setPersonTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const onEventTagsChange = (tag: string, checked: boolean) => {
    setEventTags(prev => prev.map(t => (t.value === tag ? { ...t, checked } : t)));
    updateIsBlocking();
  };

  const updateStatus = async (status: ContentStatus) => {
    if (newsData?.id) {
      const res = (await apiChangeStatusContentItem(newsData.id, status)) as any;

      if (res) {
        setStatus(res.status);
        message.success('Update status success');
      }
    }
  };

  const _debounceSearch = debounce(
    async (callback: (params: RequestParams) => any, value: string | undefined) => {
      const data = await callback({ keyword: value });

      return data;
    },
    300,
    { leading: true },
  );

  const fetchTags = async (value: string, type: string) => {
    let data: any;

    const searchValue = value.length ? value : undefined;

    switch (type) {
      case 'categories':
        data = await _debounceSearch(apiSearchCategory, searchValue);
        if (data) {
          setCategoriesSearchTags(
            data.data.map((item: Category) => ({ value: item.id, label: item.title, checked: false })),
          );
        }

        break;

      case 'companies':
        data = await _debounceSearch(apiSearchCompany, searchValue);

        if (data) {
          setCompanySearchTags(
            data.data.map((item: Company) => ({ value: item.id, label: item.name, checked: false })),
          );
        }

        break;

      case 'coins':
        data = await _debounceSearch(apiSearchCoin, searchValue);
        if (data) {
          setCryptoAssetsSearchTags(
            data.data.map((item: Coin) => ({ value: item.id, label: item.name, checked: false })),
          );
        }

        break;
      case 'products':
        data = await _debounceSearch(apiSearchProduct, searchValue);
        if (data) {
          setProductSearchTags(
            data.data.map((item: Product) => ({ value: item.id, label: item.name, checked: false })),
          );
        }

        break;

      case 'persons':
        data = await _debounceSearch(apiSearchPerson, searchValue);
        if (data) {
          setPersonsSearchTags(data.data.map((item: Person) => ({ value: item.id, label: item.name, checked: false })));
        }

        break;

      case 'events':
        data = await _debounceSearch(apiSearchEvent, searchValue);
        if (data) {
          setEventSearchTags(data.data.map((item: Event) => ({ value: item.id, label: item.name, checked: false })));
        }

        break;
      default:
        break;
    }
  };

  const handleSearchChange = (value: string, type: string) => {
    fetchTags(value, type);
  };

  const handleSearchTagsChange = (id: string, checked: boolean, label: string, type: string) => {
    switch (type) {
      case 'categories':
        if (!categoryTags.find(cate => cate.value === id)) {
          setCategoryTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setCategoryTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setCategoriesSearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;

      case 'companies':
        if (!companyTags.find(cate => cate.value === id)) {
          setCompanyTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setCompanyTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setCompanySearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;

      case 'coins':
        if (!cryptoAssetsTags.find(cate => cate.value === id)) {
          setCryptoAssetsTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setCryptoAssetsTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setCryptoAssetsSearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;

      case 'products':
        if (!productTags.find(cate => cate.value === id)) {
          setProductTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setProductTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setProductSearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;

      case 'persons':
        if (!personTags.find(cate => cate.value === id)) {
          setPersonTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setPersonTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setPersonsSearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;

      case 'events':
        if (!eventTags.find(cate => cate.value === id)) {
          setEventTags(prev => [...prev, { value: id, label, checked }]);
        } else {
          setEventTags(prev => prev.map(t => (t.value === id ? { ...t, checked } : t)));
        }

        setEventSearchTags(prev => prev.map(cate => (cate.value === id ? { ...cate, checked } : cate)));

        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div>
        <Button type={language === 'en' ? 'primary' : 'default'} onClick={() => handleChangeLanguage('en')}>
          English
        </Button>
        <Button type={language === 'vi' ? 'primary' : 'default'} onClick={() => handleChangeLanguage('vi')}>
          Vietnamese
        </Button>
      </div>

      <div className="flex items-center justify-between mt-[10px] pr-[20px]">
        <div className="">
          <Title level={3} style={{ marginBottom: 0 }}>
            {!isEdit ? 'Create Content' : 'Edit Content'}
          </Title>
        </div>
        <Space>
          <label htmlFor="publish-switch">Publish</label>
          <Switch
            id="publish-switch"
            checked={status === ContentStatus.PUBLISHED}
            onChange={e => updateStatus(e ? ContentStatus.PUBLISHED : ContentStatus.PROCESSING)}
          />
        </Space>
      </div>

      <div className="mt-[10px] bg-white p-3">
        <Form form={form} layout="vertical" onFieldsChange={() => handleFormChange()} onFinish={handleFinish}>
          <Form.Item label="Title" name="title">
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item label="Summary" name="summary">
            <TextArea placeholder="Summary" />
          </Form.Item>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">Categories:</label>
            <ContentTag
              tags={categoryTags}
              onChange={onCategoryTagsChange}
              searchTags={categoriesSearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'categories')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'categories')}
            />
          </div>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">Company:</label>
            <ContentTag
              tags={companyTags}
              onChange={onCompanyTagsChange}
              searchTags={companySearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'companies')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'companies')}
            />
          </div>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">Crypto Assets:</label>
            <ContentTag
              tags={cryptoAssetsTags}
              onChange={onCryptoAssetsTagsChange}
              searchTags={cryptoAssetsSearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'coins')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'coins')}
            />
          </div>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">Product:</label>
            <ContentTag
              tags={productTags}
              onChange={onProductTagsChange}
              searchTags={productSearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'products')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'products')}
            />
          </div>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">People:</label>
            <ContentTag
              tags={personTags}
              onChange={onPeopleTagsChange}
              searchTags={personSearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'persons')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'persons')}
            />
          </div>

          <div className="flex items-center mb-[10px]">
            <label className="mr-[10px] w-[150px] block">Event:</label>
            <ContentTag
              tags={eventTags}
              onChange={onEventTagsChange}
              searchTags={eventSearchTags}
              onSearchInputChange={value => handleSearchChange(value, 'events')}
              onSearchTagsChange={(id, checked, label) => handleSearchTagsChange(id, checked, label, 'events')}
            />
          </div>

          <div className="mt-[20px]">
            <label className="mr-[10px] w-[150px] block">Source:</label>
            <Form.Item name="source" rules={[{ type: 'url' }]}>
              <Input placeholder="Url" style={{ maxWidth: 500 }} />
            </Form.Item>
          </div>

          <div className="mt-[20px]">
            <label className="mr-[10px] block">Number Relate Article:</label>
            <Form.Item name="number_relate_article">
              <Input type="number" placeholder="Number Relate Article" step={1} min={0} style={{ maxWidth: 500 }} />
            </Form.Item>
          </div>

          <div className="mt-[20px]">
            <label className="mr-[10px] block">Stars:</label>
            <Form.Item name="stars">
              <Input type="number" max={5} min={1} step={1} placeholder="Stars" style={{ maxWidth: 500 }} />
            </Form.Item>
          </div>

          <div className="mt-[20px]">
            <label className="mr-[10px] w-[150px] block">Photos:</label>
            <WikiUploadImage
              limit={LIMIT_FILE_PHOTOS}
              fileList={photos}
              limitSize={LIMIT_FILE_SIZE}
              onChange={file => setPhotos(prev => [...prev, file])}
              onRemoveItem={file => setPhotos(prev => prev.filter(_file => _file !== file))}
              showUploadList
            />
          </div>

          <div className="mt-[20px]">
            <Editor
              data={content}
              onChange={({ editor }: { editor: any }) => {
                setContent(editor.getData() || newsData?.content);
                updateIsBlocking();
              }}
            />
          </div>

          <div className="mt-[20px] flex items-center justify-between">
            <div className="flex flex-col">
              <span>Created at: {dayjs(newsData?.created_at).format('ddd, MMM D, YYYY h:mm A')}</span>
              <span>Created by: {newsData?.author?.full_name || user.username}</span>
            </div>
            <div>
              <Button htmlType="submit">Submit</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ContentAdd;
