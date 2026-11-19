const prototypeFlow = (() => {
  const newOrder = 'NGA-20261117';
  const sampleOrder = 'NGA-20261108';
  const orders = {
    [newOrder]: { title: '数字人视频制作', client: 'Sarah Lin', status: 'waiting_assets' },
    [sampleOrder]: { title: 'Q4 新品发布会口播', client: 'Sarah Lin', status: 'waiting_confirm' },
    'NGA-20261115': { title: 'Black Friday 大促口播', client: 'Sarah Lin', status: 'waiting_assets' },
    'NGA-20261024': { title: '创始人年度致辞', client: 'Sarah Lin', status: 'completed' },
    'NGA-20261105': { title: '企业品牌介绍', client: 'Michael Ross', status: 'revision' },
    'NGA-20261112': { title: '产品功能介绍', client: 'Emily Clark', status: 'producing' },
  };
  const statusLabel = {
    waiting_assets: '待传素材', producing: '制作中', waiting_confirm: '待确认',
    revision: '需要修改', approved: '待交付', completed: '已交付',
  };
  const params = new URLSearchParams(location.search);
  const storageKey = 'nextgen-prototype-orders';
  const frame = window.frameElement;
  const inDemo = frame?.hasAttribute('data-demo-frame') === true;
  let sessionOrders = frame?.prototypeOrders ?? {};
  let storedSnapshot = null;

  if (!inDemo) {
    try {
      storedSnapshot = sessionStorage.getItem(storageKey);
      sessionOrders = JSON.parse(storedSnapshot ?? '{}') ?? {};
    } catch {
      // 当前页面仍可体验本次操作。
    }
  }

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted || inDemo) return;
    try {
      if (sessionStorage.getItem(storageKey) !== storedSnapshot) location.reload();
    } catch {
      // 无存储可用时继续显示当前流程。
    }
  });

  function currentOrder(fallback = sampleOrder) {
    const order = params.get('order');
    return Object.hasOwn(orders, order) ? order : fallback;
  }

  function href(page, order, extra = {}) {
    const query = new URLSearchParams(extra);
    if (order) query.set('order', order);
    return `./${page}.html${query.size ? `?${query}` : ''}`;
  }

  function getOrder(order) {
    return { ...orders[order], ...sessionOrders[order] };
  }

  function updateOrder(order, changes) {
    sessionOrders[order] = { ...sessionOrders[order], ...changes };
    if (!inDemo) {
      try {
        const snapshot = JSON.stringify(sessionOrders);
        sessionStorage.setItem(storageKey, snapshot);
        storedSnapshot = snapshot;
      } catch {
        // 当前页面仍可体验本次操作。
      }
    }
  }

  function addEntry(order, kind, text) {
    const entries = getOrder(order).entries ?? [];
    updateOrder(order, { entries: [...entries, { kind, text }] });
  }

  return { newOrder, sampleOrder, params, inDemo, statusLabel, currentOrder, href, getOrder, updateOrder, addEntry };
})();
