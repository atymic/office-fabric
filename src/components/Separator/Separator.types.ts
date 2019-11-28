export interface ISeparatorProps {
  /**
   * Whether the element is a vertical separator.
   */
  vertical?: boolean;

  /**
   * Where the content should be aligned in the separator.
   * @defaultValue 'center'
   */
  alignContent?: 'start' | 'center' | 'end';
}

export interface ISeparatorStyles {
  /**
   * Style for the root element
   */
  root: any;

  /**
   * Style for the content
   */
  content: any;
}
