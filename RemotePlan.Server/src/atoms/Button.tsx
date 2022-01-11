import styled from 'styled-components';
interface IProps {
  appearance?: 'primary' | 'warn' | 'danger';
}

const Button = styled.button<IProps>`
  border: 0;
  border-radius: 3px;
  background-color: ${props => props.theme.colors[props.appearance || 'primary']};
  color: ${props => props.appearance || 'primary' == 'primary'
    ? props.theme.colors.text.contrast
    : props.theme.colors.text.primary};
  padding: .5rem 1rem;
  cursor: pointer;
`;

export default Button;
