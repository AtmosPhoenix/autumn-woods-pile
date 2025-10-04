
// noinspection JSUnresolvedReference

function addLifestealProperty() {
  if (CONFIG.DND5E && CONFIG.DND5E.weaponProperties) {
    CONFIG.DND5E.weaponProperties[AutumnWoodsPile.FLAGS.LIFESTEAL] = AutumnWoodsPile.FLAGS.LIFESTEAL;
  } else {
    console.warn('AutumnWoods Pile | DND5E weapon properties not found');
  }
}

function itemHasLifestealProperty(item) {
  return item.system.properties?.lifesteal ?? false
}

/**
 * Lifesteal Properties for a wepaon/item
 * @typedef {Object} LifestealProperties
 * @property {string} id - A unique ID to identify this LifestealProperties.
 * @property {string} itemId - The id of the item this LifestealProperties applies to.
 * @property {number} diceSize - Size of the dice rolled when applying lifesteal effect
 * @property {number} diceSize - Number of dice rolled when applying lifesteal effect
 * @property {boolean} enabled - todo: NOT IMPLEMENTED - USE AS A BACKUP IF MODIFYING DND5E PROPERTIES FAILS
 */
class LifestealProperties {
  constructor(itemId) {
    this.id = foundry.utils.randomID(16);
    this.itemId = itemId;
    this.diceSize = 6;
    this.diceCount = 1;
    this.enabled = false;
  }
}

class LifestealData {

  static create(itemId) {
    const newData = new LifestealProperties(itemId);
    const newDataGroup = {
      [newData.id]: newData
    }
    return this.updateItem(itemId, newDataGroup)
  }

  static get(itemId) {
    return game.items.get(itemId)?.getFlag(
      AutumnWoodsPile.ID,
      AutumnWoodsPile.FLAGS.LIFESTEAL
    );
  }

  static getAll() {
    return game.items.entities.reduce((acc, item) => {
      const itemData = this.get(item.id);
      return {
        ...acc,
        ...itemData
      }
    });
  }

  static updateItem(itemId, updateData) {
    return game.items.get(itemId)?.setFlag(
      AutumnWoodsPile.ID,
      AutumnWoodsPile.FLAGS.LIFESTEAL,
      updateData
    );
  }

  static update(lifestealId, data) {
    const selectedData = this.getAll()[lifestealId]
    const update = {
      [lifestealId]: data
    }
    return this.updateItem(selectedData.itemId, update)
  }

  static delete(lifestealId) {
    const selectedData = this.getAll()[lifestealId]
    const update = {
      [`-=${lifestealId}`]: null
    }
    return game.items.get(selectedData.itemId)?.setFlag(
      AutumnWoodsPile.ID,
      AutumnWoodsPile.FLAGS.LIFESTEAL,
      update
    );
  }
}

class LifestealInterface {

  // TODO: cleanup - this is just for reference - delete when code is working properly
  // <dnd5e-checkbox name="system.damage.base.custom.enabled" checked="" tabindex="0" disabled=""></dnd5e-checkbox>
  // <input type="text" name="system.damage.base.custom.formula" value="1d8+2 + @abilities.str.mod" disabled="">

  // TODO: cleanup - this is just for reference - delete when code is working properly
  // // Healing Dice input
  // const healField = `
  //   <div class="form-group">
  //     <label>Healing Dice</label>
  //     <input type="text" name="flags.autumn-woods-pile.healingDice" value="${currentDice}" data-dtype="String"/>
  //     <p class="notes">Dice formula (e.g. 1d6, 2d4+1). Rolled only if weapon has Lifesteal.</p>
  //   </div>`;
  // propSection.append(healField);

  static makeHtml(lifestealData) {
    let html = document.createElement("fieldset");
    html.innerHTML = `
      <legend>Lifesteal</legend>
      <div class="form-fields">
        <p class="hint">Intrinsic healing dice from the weapon.</p>
      </div>
      <div>
        <h1>JUST TESTING HEHE</h1>
        <h3>TODO:</h3>
        <ul>
          <li>Dropdown field for dice size.</li>
          <li>Dice size is stored/updated using lifestealData property</li>
          <li>Integer-only field for dice count</li>
          <li>Dice count is stored/updated using lifestealData property</li>
        </ul>
      </div>
      <h3>Data test:</h3>
      <span>lifestealData.diceSize: ${lifestealData.diceSize}</span>
      <span>lifestealData.diceCount: ${lifestealData.diceCount}</span>
    `;
    return html;
  }

  static onRenderItemSheet(app, html, data) {
    const item = app.document;
    if (item.type !== "weapon") return;

    // Check if the stuff is there...
    console.log(item.system.properties);
    console.log(item.system.properties?.lifesteal)

    // If the item has the lifesteal property active, draw the lifesteal section.
    if (itemHasLifestealProperty(item)) {

      // If data, use it; If not, create it.
      let lifestealData = LifestealData.get(item.id);
      if (!lifestealData) {
        console.log("Creating new lifesteal data");
        lifestealData = LifestealData.create(item.id);
      }
      console.log(lifestealData);

      // Render html
      // TODO: figure out how to make Jquery work or use vanilla to insert html in the correct spot
      let contentSection = html.getElementsByClassName("window-content")[0];
      let detailsSection = contentSection.getElementsByTagName("section")[3];
      detailsSection.insertBefore(his.makeHtml(lifestealData), detailsSection.getElementsByTagName("fieldset")[3]);
    }
  }
}

Hooks.on('setup', addLifestealProperty);
Hooks.on('renderItemSheet5e', LifestealInterface.onRenderItemSheet);