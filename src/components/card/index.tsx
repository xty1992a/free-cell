import React, {FC, HTMLAttributes,} from "react";
import css from "styled-jsx/css";
import classnames from "classnames";
import * as types from "@/types";
import {Poker} from "@/core/poker.ts";
import IconFont from "@/components/icon.tsx";

const styles = css`
  .card {
    flex-shrink: 0;
    aspect-ratio: 0.62;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    //box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-shadow: -4px -4px 8px 0 rgba(0, 0, 0, 0.08);
    color: var(--color);
    line-height: 1;
  }

  .text {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

interface Props extends HTMLAttributes<HTMLDivElement> {
    poker: Poker
    size?: number
}

const Card: FC<Props> = (props) => {
    const {poker, size = 100, ...rest} = props
    const style = {
        width: size,
        fontSize: size * 0.25,
        ['--color']: poker.color
    }

    return (
        <div {...rest}
             className={classnames("card", rest.className)}
             style={{
                 ...rest.style,
                 ...style
             }}

             onClick={() => {
                 console.log('')
                 console.log('')
                 console.log(`点击了${poker.belong?.label}的${poker.label}`)
                 const ok = poker.seek()
                 console.log(`${poker.label} 移动${ok ? (poker.belong?.label + '成功') : '失败'}`)
                 console.log('')
                 console.log('')
             }}
        >
            <div className="text">
                <span>{poker.value}</span>
                <IconFont name={poker.series}/>
            </div>
            <IconFont style={{fontSize: size * 0.5}} name={poker.series}/>
            <div className="text">
                <IconFont name={poker.series}/>
                <span>{poker.value}</span>
            </div>
            <style jsx>{styles}</style>
        </div>
    );
};

export default Card;
