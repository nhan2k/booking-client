import { TOption } from '@/types';
import React from 'react';

type Props = {
  options: TOption[];
  label?: string;
  props: any;
};

function Component({ options, label, props }: Props) {
  return (
    <React.Fragment>
      {label ? (
        <label htmlFor={label}>{label}</label>
      ) : (
        <React.Fragment />
      )}
      <select id={label} {...props}>
        {options.map((e) => (
          <option value={e.value}>{e.label}</option>
        ))}
      </select>
    </React.Fragment>
  );
}

export default Component;
