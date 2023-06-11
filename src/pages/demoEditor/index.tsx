import { Editor } from '@/components/editor';
import { FC } from 'react';
export const DemoEditor: FC = () => {
  return (
    <Editor
      data={`<blockquote class="twitter-tweet"><p lang="zxx" dir="ltr"><a href="https://t.co/eVlSDjBc0g">pic.twitter.com/eVlSDjBc0g</a></p>&mdash; 90’s aesthetics ✨ (@90sFeeIing) <a href="https://twitter.com/90sFeeIing/status/1562471690801541123?ref_src=twsrc%5Etfw">August 24, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`}
    />
  );
};
