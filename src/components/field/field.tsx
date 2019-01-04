import { Component, Prop } from '@stencil/core';

// INCOMPLETE

@Component({
  tag: 'iea-field',
  styleUrl: 'field.scss',
  shadow: true
})
export class MyComponent {
  @Prop()
  type: string;

  @Prop()
  label: string;

  @Prop()
  placeholder: string;

  @Prop()
  id: string = Math.random()
    .toString(36)
    .substr(-4);

  @Prop()
  value: string;

  @Prop()
  pattern: string;

  @Prop()
  className: string;

  render() {
    const { type, id, value, label, placeholder, className: _className, pattern: _pattern } = this;

    const className = 'field' + (_className ? ' ' + _className : '');

    // To make iOS show number pad when type=number:
    const pattern = !_pattern && type === 'number' ? '\\d*' : _pattern;

    // Important: Label is deliberately AFTER the input:
    // This allows input state to affect label style via css.
    // If you need to change the order, use flexbox or grid etc.
    return (
      <div class="wrapper">
        <input
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          pattern={pattern}
          class={className}
        />
        <label htmlFor={id} class="label">
          {label}
        </label>
      </div>
    );
  }
}
