import React, { useState } from "react";
import { Button } from "primereact/button";
import InputTable from "./InputTable";
import FunctionToolbar from "./FunctionToolbar";
import OutputTable from "./OutputTable";
import ModeToggle from "./ModeToggle";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeicons/primeicons.css";
import "./App.css";

/*
  Input and Output config on top
  side by side formulas A and B
  buttons split into three columns
  add / subtract / clear
  copy to A / B / Swap
  Undo / Redo / History
  
  some kind of visual confirmation for every action
  negative numbers will come up highlighted red
  inputs over fraction in input tables will be highlighted yellow
  inputs with values but no pigment will be highlighted red
  inputs with pigments with no values will be highlighted yellow
  
*/

export default function App() {
  //decimal precision
  const P = 10000;

  const scaleOptions = [0.1, 0.2, 0.25, 0.5, 1, 2, 4, 5, 10];

  const scaleOptionsTemplate = (option) => {
    return `${option}x`;
  };

  //pigment map gives us the available pigments
  const gennexPigments = [
    { name: "S1", color: "#000000" },
    { name: "S2", color: "#808080" },
    { name: "W1", color: "#FFFFFF" },
    { name: "B1", color: "#0000FF" },
    { name: "O1", color: "#D35400" },
    { name: "G1", color: "#186A3B" },
    { name: "M1", color: "#D10069" },
    { name: "Y1", color: "#FFFF00" },
    { name: "Y2", color: "#FFD900" },
    { name: "Y3", color: "#FFA600" },
    { name: "R1", color: "#FF0000" },
    { name: "R2", color: "#CB3434" },
    { name: "R3", color: "#7E2020" },
  ];

  const oilPigments = [
    { name: "B", color: "#000000" },
    { name: "KX", color: "#FFFFFF" },
    { name: "F", color: "#922626" },
    { name: "R", color: "#ff0000" },
    { name: "AXX", color: "#ffff00" },
    { name: "C", color: "#FFD900" },
    { name: "L", color: "#4D3200" },
    { name: "I", color: "#522600" },
    { name: "V", color: "#E600E6" },
    { name: "T", color: "#FFE866" },
    { name: "D", color: "#00E600" },
    { name: "E", color: "#0000FF" },
  ];

  //config gives us the structure of the table and all the info we need to perform calculations
  const AceConfig = {
    shots: true,
    decimals: false,
    fractions: [1, 32, 256],
    pigments: gennexPigments,
  };

  const BenMooreConfig = {
    shots: true,
    decimals: true,
    fractions: [1, 32],
    pigments: gennexPigments,
  };

  const OilBasedConfig = {
    shots: true,
    decimals: false,
    fractions: [1, 48, 96, 192],
    pigments: oilPigments,
  };

  const formatOptions = [
    { name: "Ace", value: AceConfig },
    { name: "Ben Moore", value: BenMooreConfig },
    { name: "Oil Based", value: OilBasedConfig },
  ];

  function createDefaultRows(config) {
    let defaultRows = [];
    for (let i = 0; i < 3; i++) {
      defaultRows.push({
        id: crypto.randomUUID().slice(0, 8),
        pigment: {},
        values: config.fractions.map((v) => v * 0),
        error: 0,
      });
    }
    return defaultRows;
  }

  const [inputConfig, setInputConfig] = useState(OilBasedConfig);
  const [outputConfig, setOutputConfig] = useState(OilBasedConfig);
  const [inputTableA, setInputTableA] = useState(
    createDefaultRows(inputConfig),
  );
  const [inputTableB, setInputTableB] = useState(
    createDefaultRows(inputConfig),
  );
  const [outputTable, setOutputTable] = useState([]);
  const [undoQueue, setUndoQueue] = useState([]);
  const [undoLock, setUndoLock] = useState(false);
  const [redoQueue, setRedoQueue] = useState([]);
  const [outputScaleFactor, setOutputScaleFactor] = useState(1);
  const [scaledOutput, setScaledOutput] = useState([]);

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }

  function leastCommonDenominator(denoms) {
    return denoms.reduce((acc, val) => lcm(acc, val));
  }

  function getRowInTermsOfLCD(row, config) {
    const lcd = leastCommonDenominator(config.fractions);
    let total = 0;
    for (let i = 0; i < config.fractions.length; i++) {
      const denominator = config.fractions[i];
      const numerator = row.values[i];
      let add = numerator * (lcd / denominator);
      total += add;
    }
    return total;
  }

  function updateConfig(newConfig) {
    setInputConfig(newConfig);
    setOutputConfig(newConfig);
    let newRows = createDefaultRows(newConfig);
    setInputTableA(newRows);
    setInputTableB(newRows);
    setOutputScaleFactor(1);
    setOutputTable([]);
  }

  function reduceTotal(total, config) {
    let lcd = leastCommonDenominator(config.fractions);
    let remainder = total;
    let result_cols = [];
    for (let i = 0; i < config.fractions.length; i++) {
      const denominator = config.fractions[i];
      const numerator = remainder - (remainder % (lcd / denominator));
      remainder = remainder - numerator;
      result_cols.push(numerator / (lcd / denominator));
    }
    return result_cols;
  }

  function reduceRow(row, config) {
    if (config.decimals) {
      let oz = row.values[0] * P;
      let sh = row.values[1] * P;
      console.log("oz: " + oz);
      console.log("sh: " + sh);
      while (sh > config.fractions[1] * P) {
        sh -= config.fractions[1] * P;
        oz += P;
      }
      return {
        pigment: row.pigment,
        values: [oz / P, sh / P],
      };
    } else {
      const total = getRowInTermsOfLCD(row, config);
      return {
        pigment: row.pigment,
        values: reduceTotal(total, config),
      };
    }
  }

  function undo() {}

  function redo() {}

  function addRows(factor, row1, row2) {
    if (inputConfig.decimals) {
      console.log("r1: " + row1.values);
      console.log("r2: " + row2.values);
      const r1 =
        row1.values[0] * inputConfig.fractions[1] * P +
        parseFloat(row1.values[1]) * P;
      const r2 =
        row2.values[0] * inputConfig.fractions[1] * P +
        parseFloat(row2.values[1]) * P;
      const result = r1 + factor * r2;
      const numOunces = Math.floor(result / (inputConfig.fractions[1] * P));
      const numShots = (result - numOunces * P * inputConfig.fractions[1]) / P;
      return {
        id: crypto.randomUUID().slice(0, 8),
        pigment: row1.pigment,
        values: [numOunces * 1.0, numShots],
      };
    } else {
      const result =
        getRowInTermsOfLCD(row1, inputConfig) +
        factor * getRowInTermsOfLCD(row2, inputConfig);
      return {
        id: crypto.randomUUID().slice(0, 8),
        pigment: row1.pigment,
        values: reduceTotal(result, outputConfig),
      };
    }
  }

  function add(factor) {
    let result = [...inputTableB];
    result = result.map((r) => reduceRow(r, outputConfig));
    inputTableA.forEach((ra) => {
      let flag = false;
      for (let i = 0; i < result.length; i++) {
        let rr = result[i];
        if (ra.pigment.name == rr.pigment.name) {
          result[i] = addRows(factor, ra, rr);
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(reduceRow(ra, outputConfig));
      }
    });
    console.log(result);
    setOutputScaleFactor(1);
    setOutputTable(result);
  }

  function copyTo(table) {
    table == "A" ? setInputTableA(outputTable) : setInputTableB(outputTable);
  }

  function clear() {
    setInputTableA([]);
    setInputTableB([]);
    const defaultRows = createDefaultRows(inputConfig);
    setInputTableA(defaultRows);
    setInputTableB(defaultRows);
    setOutputScaleFactor(1);
    setOutputTable([]);
  }

  function swap() {
    let swapTable = [...inputTableA];
    setInputTableA([...inputTableB]);
    setInputTableB(swapTable);
  }

  function scaleRow(row, outputConfig) {
    let result = 0;

    if (inputConfig.decimals) {
      const row_in_terms_of_lcd =
        row.values[0] * inputConfig.fractions[1] * P +
        parseFloat(row.values[1]) * P;
      result = row_in_terms_of_lcd * outputScaleFactor;
      const numOunces = Math.floor(result / (inputConfig.fractions[1] * P));
      const numShots = (result - numOunces * P * inputConfig.fractions[1]) / P;
      return {
        id: row.id,
        pigment: row.pigment,
        values: [numOunces * 1.0, numShots],
      };
    } else {
      const result = Math.floor(
        getRowInTermsOfLCD(row, outputConfig) * outputScaleFactor,
      );
      return {
        id: row.id,
        pigment: row.pigment,
        values: reduceTotal(result, outputConfig),
      };
    }
  }

  function scaleOutput() {
    return outputTable.map((r) => scaleRow(r, outputConfig));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", padding: "2rem" }}>
        <Button label="Clear" icon="pi pi-times" onClick={() => clear()} />
        <Dropdown
          options={formatOptions}
          optionLabel="name"
          value={inputConfig}
          onChange={(e) => updateConfig(e.value)}
        />
      </div>
      <div style={{ padding: "2rem" }}>
        <InputTable
          formulaName="A"
          rows={inputTableA}
          config={inputConfig}
          updateRows={setInputTableA}
        />
        <InputTable
          formulaName="B"
          rows={inputTableB}
          config={inputConfig}
          updateRows={setInputTableB}
        />
      </div>
      <div>
        <div style={{ display: "flex", gap: "0.5rem", padding: "2rem" }}>
          <Button label="Add" icon="pi pi-plus-circle" onClick={() => add(1)} />
          <Button
            label="Subtract"
            icon="pi pi-minus-circle"
            onClick={() => add(-1)}
          />

          <Button
            label="Copy result to Formula A"
            icon="pi pi-copy"
            onClick={() => copyTo("A")}
          />
          <Button
            label="Copy result to Formula B"
            icon="pi pi-copy"
            onClick={() => copyTo("B")}
          />
          <Button
            label="Swap formula A and B"
            icon="pi pi-arrows-v"
            onClick={() => swap()}
          />
        </div>
      </div>
      <SelectButton
        value={outputScaleFactor}
        onChange={(e) => setOutputScaleFactor(e.value)}
        itemTemplate={scaleOptionsTemplate}
        optionLabel="Scale Output By:"
        options={scaleOptions}
      />
      <OutputTable config={outputConfig} rows={scaleOutput()} />
      <div text-align="center">
        <p>
          Licensed under the <a href="https://mit-license.org">MIT License</a>
        </p>
        <p>
          Source Code Available on{" "}
          <a href="https://github.com/paintshoptools">Github</a>
        </p>
      </div>
    </div>
  );
}
