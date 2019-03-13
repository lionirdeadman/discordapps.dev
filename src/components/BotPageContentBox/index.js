import React, { Component } from 'react';
import ContentBox from '../ContentBox';
import marked from 'marked';
import xss from 'xss';
import modesta from '../../ModestaCSS/scss/modesta.module.scss';
import arrow from '../../ModestaCSS/css/images/arrow.png';
import styles from './index.module.scss';
import { FormattedMessage } from 'react-intl';

class BotPageContentBox extends Component {
  constructor(props) {
    super(props);

    this.button = React.createRef();
    this.description = React.createRef();

    this.state = {
      open: false,
      smallEnough: true
    };

    this.toggle = this.toggle.bind(this);
    this.getExtendedHeight = this.getExtendedHeight.bind(this);
  }

  getExtendedHeight = () => [...this.description.current.children]
    .map((elem) => {
      const height = elem.clientHeight;
      let topMargin = 2;
      let bottomMargin = 2;

      try {
        topMargin = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-top'), 10);
        bottomMargin = parseInt(document.defaultView.getComputedStyle(elem, '').getPropertyValue('margin-bottom'), 10);
      } catch (e) {
        // Do nothing!
        // Just use the default margin sizes.
      }

      return topMargin + height + bottomMargin;
    })
    .reduce((prev, curr) => prev + curr, 0);

  toggle() {
    if (this.state.open === true) {
      this.description.current.style.height = '200px';
    } else {
      this.description.current.style.height = `${this.getExtendedHeight()}px`;
    }

    this.setState({
      open: !this.state.open
    });
  }

  componentDidMount() {
    if (this.getExtendedHeight() > 300) {
      this.setState({
        smallEnough: false
      });
    }
  }

  render() {
    const page = xss(marked(this.props.page), {
      whiteList: {
        p: [],
        span: [],
        code: [],
        b: [],
        i: [],
        li: [],
        ul: [],
        ol: [],
        del: [],
        pre: [],
        strong: [],
        em: [],
        h1: ['id'],
        h2: ['id'],
        h3: ['id'],
        h4: ['id'],
        h5: ['id'],
        h6: ['id'],
        table: [],
        thead: [],
        tbody: [],
        tr: [],
        th: [],
        td: [],
        hr: [],
        blockquote: [],
        br: [],
        a: ['href']
      }
    })

    return (
      <ContentBox>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: page
            }}
            ref={this.description}
            style={this.state.smallEnough ? {} : { // if not small enough, set default height to 200
              height: '200px',
              transition: `height ${Math.ceil(this.getExtendedHeight() / 200) / 20}s`
            }}
            className={styles.description}
          ></div>
          {this.state.smallEnough ? null : // if not small enough, show the buttons
            <div ref={this.button} onClick={this.toggle}>
              { this.state.open === false ?
                <ContentBox className={`${modesta.secondary} ${styles.button}`}>
                  <p><FormattedMessage id="components.botpagecontentbox.more" /></p>
                  <FormattedMessage id="components.botpagecontentbox.toggle">
                    {message => <img className={styles.arrow} src={arrow} alt={message}/>}
                  </FormattedMessage>
                </ContentBox> :
                <ContentBox className={`${modesta.secondary} ${styles.button}`}>
                  <p><FormattedMessage id="components.botpagecontentbox.less" /></p>
                  <FormattedMessage id="components.botpagecontentbox.toggle">
                    {message => <img className={`${styles.arrow} ${styles.upsidedown}`} src={arrow} alt={message}/>}
                  </FormattedMessage>
                </ContentBox>
              }
            </div>
          }
        </div>
      </ContentBox>
    )
  }
}

export default BotPageContentBox;
