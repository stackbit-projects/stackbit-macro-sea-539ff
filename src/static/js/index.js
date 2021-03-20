

document.addEventListener('snipcart.ready', () => {
    Snipcart.store.subscribe(() => {
        const _count = Snipcart.store.getState().cart.items.count;
        document.querySelectorAll('.snipcart-checkout').forEach(el=>{
            el.hidden = (_count < 1);
        })
    });        
    Snipcart.api.session.setLanguage('en', {
        header: {
          title_cart_summary: "BAG CHECK !",
        },
        actions: {
          continue_shopping: "Keep adding!",
        }
      });
  });

