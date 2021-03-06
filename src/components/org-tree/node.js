// 判断是否有子节点
const isLeaf = (data, prop) => {
  return !(Array.isArray(data[prop]) && data[prop].length > 0);
};

// 创建 node 节点
export const renderNode = (h, data, context) => {
  const { props } = context;
  const cls = ['org-tree-node'];
  const childNodes = [];
  const children = data[props.props.children];

  if (isLeaf(data, props.props.children)) {
    cls.push('is-leaf');
  } else if (props.collapsable && !data[props.props.expand]) {
    cls.push('collapsed');
  }

  childNodes.push(renderLabel(h, data, context));

  if (!props.collapsable || data[props.props.expand]) {
    childNodes.push(renderChildren(h, children, context));
  }
  return h('div', {
    domProps: {
      className: cls.join(' ')
    }
  }, childNodes);
};

// 创建节点文字显示div
export const renderNodeInner = (h, data, { props, listeners }) => {
  const label = data[props.props.label];

  // event handlers
  const clickHandler = listeners['on-node-click'];
  const mouseOverHandler = listeners['on-node-mouseover'];
  const mouseOutHandler = listeners['on-node-mouseout'];

  let cls = ['org-tree-node-label-inner'];
  let { labelWidth, labelClassName, selectedClassName, selectedKey } = props;

  if (typeof labelWidth === 'number') {
    labelWidth += 'px';
  }

  if (typeof labelClassName === 'function') {
    labelClassName = labelClassName(data);
  }

  labelClassName && cls.push(labelClassName);

  // add selected class and key from props
  if (typeof selectedClassName === 'function') {
    selectedClassName = selectedClassName(data);
  }

  selectedClassName && selectedKey && data[selectedKey] && cls.push(selectedClassName);

  return h('div', {
    domProps: {
      className: cls.join(' '),
      innerHTML: label
    },
    on: {
      'click': e => clickHandler && clickHandler(e, data),
      'mouseover': e => mouseOverHandler && mouseOverHandler(e, data),
      'mouseout': e => mouseOutHandler && mouseOutHandler(e, data)
    }
  });
};

// 创建展开折叠按钮
export const renderBtn = (h, data, { props, listeners }) => {
  const expandHandler = listeners['on-expand'];

  let cls = ['org-tree-node-btn'];

  if (data[props.props.expand]) {
    cls.push('expanded');
  }

  return h('span', {
    domProps: {
      className: cls.join(' ')
    },
    on: {
      click: e => expandHandler && expandHandler(e, data)
    }
  });
};

// 创建 label 节点
export const renderLabel = (h, data, context) => {
  const { props } = context;

  const childNodes = [];
  childNodes.push(renderNodeInner(h, data, context));
  if (props.collapsable && !isLeaf(data, props.props.children)) {
    childNodes.push(renderBtn(h, data, context));
  }
  return h('div', {
    domProps: {
      className: 'org-tree-node-label'
    }
  }, childNodes);
};

// 创建 node 子节点
export const renderChildren = (h, list, context) => {
  if (Array.isArray(list) && list.length) {
    const children = list.map(item => {
      return renderNode(h, item, context);
    });

    return h('div', {
      domProps: {
        className: 'org-tree-node-children'
      }
    }, children);
  }
  return '';
};

export const render = (h, context) => {
  const { props } = context;

  console.log(context.listeners);
  return renderNode(h, props.data, context);
};

export default render;
