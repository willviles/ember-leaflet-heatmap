import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('heatmap-marker', 'Integration | Component | heatmap marker', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{heatmap-marker}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#heatmap-marker}}
      template block text
    {{/heatmap-marker}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
