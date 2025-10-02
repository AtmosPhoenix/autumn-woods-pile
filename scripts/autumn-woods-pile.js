Hooks.once("init", () => {
  console.warn("===================== AUTUMWOODS INIT =====================");
  game.modules.get("healing-on-hit").api = {
    // You can add API methods here if needed
  };
  // Register custom module settings
  game.settings.register("autumn-woods-pile", "healingDice", {
    scope: "world",
    config: false,
    type: String,
    default: ""
  });
});



Hooks.on("dnd5e.rollDamage", async (item, roll, targets) => {
  try {
    if (!item || item.type !== "weapon") return;

    const props = item.system.properties || {};
    if (!props.lifesteal) return;

    const healingFormula = item.getFlag("autumn-woods-pile", "healingDice");
    if (!healingFormula) return;

    const healingRoll = await new Roll(healingFormula).roll({async: true});
    await healingRoll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: item.actor }),
      flavor: `${item.name} drains life and restores ${healingRoll.total} HP to its wielder!`
    });

    const actor = item.actor;
    if (!actor) return;

    const hp = actor.system.attributes.hp;
    const newHp = Math.clamped(hp.value + healingRoll.total, 0, hp.max);
    await actor.update({"system.attributes.hp.value": newHp});

  } catch (err) {
    console.error("Healing on Hit | Error:", err);
  }
});

Hooks.on("renderItemSheet5e", (app, html, data) => {
  console.log("===================== AUTUMWOODS RENDER ITEM SHEET =====================");
  console.log(app);
  console.log("app.document:")
  console.log(app.document);

  if (app.document.type !== "weapon") {
    console.warn("This ain't a weapon yo")
    return;
  } else {
    console.log("found weapon ok")
  }

  const item = app.document; // I sure hope that's right hehe~!
  const currentDice = item.getFlag("autumn-woods-pile", "healingDice") || "";
  const lifestealChecked = item.system.properties?.lifesteal ? "checked" : "";

  console.log(html);

  // Attempt to find the properties container
  //let propSection = html.find("input[name='system.properties.fin']").closest(".form-group").parent();
  let contentSection = html.getElementsByClassName("window-content")[0];
  let detailsSection = contentSection.getElementsByTagName("section")[3]; // YEAH I KNOWWWW KILL ME
  let propSection = detailsSection.getElementsByClassName("checkbox-grid")[0];
  let boxes = propSection.getElementsByTagName("div")[0]; // HEHE THE AI IS MOULDING TO MEEEEE
  if (propSection) {
    console.log("OwO is that the props section???!!!! WIT DA CHEKKKNBOWXESSSS????");
  }
  else {
    console.error("Could not find details section");
  }
  //if (!propSection || propSection.length === 0) propSection = html.find(".sheet-body");

  // Lifesteal checkbox
  let newCheckbox = document.createElement("label");
  newCheckbox.innerHTML = `
    <dnd5e-checkbox name="system.properties.lifesteal" tabindex="0">
      <div>
        <div class="checked">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com/ License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
          </svg>
        </div>
        <div class="disabled">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com/ License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path>
          </svg>
        </div>
        <div class="indeterminate">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com/ License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path>
          </svg>
        </div>
      </div>
    </dnd5e-checkbox>
    <span>Lifesteal</span>
  `
  newCheckbox.className = "checkbox";
  boxes.appendChild(newCheckbox);

  // let her be insane for a bit pleasE?
  let lifestealHTML =document.createElement("div");
  lifestealHTML.innerHTML = `
    <h1>AUTUMN DID IT BITCH!!!</h1>
    <p>Code Witch (tm)</p>
    <div class="form-group">
      <label class="checkbox">
        <input type="checkbox" name="system.properties.lifesteal" ${lifestealChecked}/>
        Lifesteal
      </label>
    </div>;`
  detailsSection.appendChild(lifestealHTML);
  /*
  // Healing Dice input
  const healField = `
    <div class="form-group">
      <label>Healing Dice</label>
      <input type="text" name="flags.autumn-woods-pile.healingDice" value="${currentDice}" data-dtype="String"/>
      <p class="notes">Dice formula (e.g. 1d6, 2d4+1). Rolled only if weapon has Lifesteal.</p>
    </div>`;
  propSection.append(healField);
  */
});
