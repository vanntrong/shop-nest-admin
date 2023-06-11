export const handleChange = ({ editor }: { editor: any }) => {
  // const data = editor.getData();

  console.log('%c Editor Change', 'color:green', { editor });
};

export const handleReady = (editor: any) => {
  console.log('%c Editor is ready to use!', 'color:green', { editor });
};

export const handleBlur = (event: Event, editor: any) => {
  console.log('Editor Blur.', { event, editor });
};

export const handleFocus = (event: Event, editor: any) => {
  console.log('Editor Focus.', { event, editor });
};

export const handleError = (event: Event, editor: any) => {
  console.log('%c Editor Error!', 'color:red', { event, editor });
};
