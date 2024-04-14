import React, {FC, HTMLAttributes,} from "react";
import css from "styled-jsx/css";

const styles = css`
  .iconfont {
  }
`;


interface Props extends HTMLAttributes<HTMLOrSVGElement>{
    name: string
    color?: string
}

const IconFont: FC<Props> = (props) => {
    const {name, color='currentColor', ...rest} = props
    return (
        <svg {...rest} style={{...rest.style, width: '1em', height: '1em'}}>
            <use xlinkHref={`#icon-${name}`} fill={color}></use>
        </svg>
    );
};

export default IconFont;
