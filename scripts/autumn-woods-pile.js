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
  let propSection = detailsSection.getElementsByTagName("div")[4];
  let boxes = detailsSection.getElementsByTagName("div")[0]; // HEHE THE AI IS MOULDING TO MEEEEE
  if (propSection) {
    console.log("OwO is that the props section???!!!! WIT DA CHEKKKNBOWXESSSS????");
  }
  else {
    console.error("Could not find details section");
  }
  //if (!propSection || propSection.length === 0) propSection = html.find(".sheet-body");

  // Lifesteal checkbox
  let newCheckbox = document.createElement("div");
  newCheckbox.innerHTML = `
    <label class="checkbox">
      <input type="checkbox" name="system.properties.lifesteal" ${lifestealChecked}/>
      Lifesteal
    </label>
  `
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
