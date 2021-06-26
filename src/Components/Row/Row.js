import "./Row.css";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

//Define query options
const options = [
  { value: "User Email", type: "string", id: "userEmail", sql: "user_email" },
  {
    value: "Screen Width",
    type: "number",
    id: "screenWidth",
    sql: "screen_width",
  },
  {
    value: "Screen Height",
    type: "number",
    id: "screenHeight",
    sql: "screen_height",
  },
  { value: "# of Visits", type: "number", id: "#ofVisits", sql: "visits" },
  { value: "First Name", type: "string", id: "firstName", sql: "first_name" },
  { value: "Last Name", type: "string", id: "lastName", sql: "last_name" },
  {
    value: "Page Response time (ms)",
    type: "number",
    id: "pageResponseTime",
    sql: "page_response",
  },
  { value: "Domain", type: "string", id: "domain", sql: "domain" },
  { value: "Page Path", type: "string", id: "pagePath", sql: "path" },
];

//Define number operators
const numberOperators = [
  { value: "equals", id: "numberEquals" },
  { value: "between", id: "between" },
  { value: "greater than", id: "greaterThan" },
  { value: "less than", id: "lessThan" },
  { value: "in list", id: "numberInList" },
];

//Define string operators
const stringOperators = [
  { value: "equals", id: "stringEquals" },
  { value: "contains", id: "contains" },
  { value: "starts with", id: "startsWith" },
  { value: "in list", id: "stringInList" },
];

//Define row component
function Row({ handleDeleteButton, id, getSqlStatement, removeSqlStatement }) {
  //Initialize state for current query option
  const [option, setOption] = useState(options[0]);

  //Build our option list for query options
  const optionsList = options.map(({ value, id }) => {
    return <option key={id}>{value}</option>;
  });

  //Initialize state for current set of operators
  const [operators, setOperators] = useState(() =>
    option.type === "string" ? stringOperators : numberOperators
  );

  //Build our option list for current set of operators
  const operatorsList = operators.map(({ value, id }) => {
    return <option key={id}>{value}</option>;
  });

  //Initialize state for the current operator
  const [operator, setOperator] = useState(operators[0]);

  //Initialize state for query statement
  const [queryStatement, setQueryStatement] = useState("");

  //Initialize state for query inputs
  const [queryInputs, setQueryInputs] = useState({
    numberEquals: "",
    stringEquals: "",
    numberInList: "",
    stringInList: "",
    contains: "",
    startsWith: "",
    between1: "",
    between2: "",
    greaterThan: "",
    lessThan: "",
  });

  //Get query input values
  const {
    numberEquals,
    numberInList,
    stringEquals,
    stringInList,
    contains,
    startsWith,
    between1,
    between2,
    greaterThan,
    lessThan,
  } = queryInputs;

  //Update state on query input changes
  const onInputChange = (input, value) => {
    switch (input) {
      case "numberEquals":
        setQueryInputs({
          ...queryInputs,
          numberEquals: value,
        });
        break;
      case "numberInList":
        setQueryInputs({
          ...queryInputs,
          numberInList: value,
        });
        break;
      case "stringEquals":
        setQueryInputs({
          ...queryInputs,
          stringEquals: value,
        });
        break;
      case "stringInList":
        setQueryInputs({
          ...queryInputs,
          stringInList: value,
        });
        break;
      case "contains":
        setQueryInputs({
          ...queryInputs,
          contains: value,
        });
        break;
      case "startsWith":
        setQueryInputs({
          ...queryInputs,
          startsWith: value,
        });
        break;
      case "between1":
        setQueryInputs({
          ...queryInputs,
          between1: value,
        });
        break;
      case "between2":
        setQueryInputs({
          ...queryInputs,
          between2: value,
        });
        break;
      case "greaterThan":
        setQueryInputs({
          ...queryInputs,
          greaterThan: value,
        });
        break;
      case "lessThan":
        setQueryInputs({
          ...queryInputs,
          lessThan: value,
        });
        break;
      default:
        throw new Error(`No case to update input value for input ${input}`);
    }
  };

  //Build query statement based on current options, operators and inputs
  const buildQueryStatement = () => {
    const column = option.sql;
    switch (operator.id) {
      case "stringEquals":
        return `${column} = '${stringEquals}'`;
      case "numberEquals":
        return `${column} = ${numberEquals}`;
      case "startsWith":
        return `${column} LIKE '${startsWith}%'`;
      case "contains":
        return `${column} LIKE '%${contains}%'`;
      case "between":
        return `${column} BETWEEN ${between1} AND ${between2}`;
      case "greaterThan":
        return `${column} > ${greaterThan}`;
      case "lessThan":
        return `${column} < ${lessThan}`;
      case "stringInList":
        const stringItems = stringInList
          .split(" ")
          .map((item) => `'${item}'`)
          .toString();
        return `${column} IN (${stringItems})`;
      case "numberInList":
        const numberItems = numberInList
          .split(" ")
          .map((item) => `${item}`)
          .toString();
        return `${column} IN (${numberItems})`;
      default:
        throw new Error(
          `Problem building query statement with option ${column}`
        );
    }
  };

  //Switch statement to determine which operator template to use
  const operatorTemplate = () => {
    const value = operator.value;
    switch (value) {
      case "equals":
        return option.type === "number" ? (
          <input
            placeholder={0}
            value={numberEquals}
            onChange={(event) =>
              onInputChange("numberEquals", event.target.value)
            }
          />
        ) : (
          <input
            placeholder='website.com'
            value={stringEquals}
            onChange={(event) =>
              onInputChange("stringEquals", event.target.value)
            }
          />
        );
      case "between":
        return (
          <>
            <input
              placeholder={0}
              value={between1}
              onChange={(event) =>
                onInputChange("between1", event.target.value)
              }
            />
            <span className='and'>and</span>
            <input
              placeholder={0}
              value={between2}
              onChange={(event) =>
                onInputChange("between2", event.target.value)
              }
            />
          </>
        );
      case "greater than":
        return (
          <input
            placeholder={0}
            value={greaterThan}
            onChange={(event) =>
              onInputChange("greaterThan", event.target.value)
            }
          />
        );
      case "less than":
        return (
          <input
            placeholder={0}
            value={lessThan}
            onChange={(event) => onInputChange("lessThan", event.target.value)}
          />
        );
      case "in list":
        return option.type === "number" ? (
          <input
            placeholder={0}
            value={numberInList}
            onChange={(event) =>
              onInputChange("numberInList", event.target.value)
            }
          />
        ) : (
          <input
            placeholder='website.com'
            value={stringInList}
            onChange={(event) =>
              onInputChange("stringInList", event.target.value)
            }
          />
        );
      case "contains":
        return (
          <input
            placeholder='website.com'
            value={contains}
            onChange={(event) => onInputChange("contains", event.target.value)}
          />
        );
      case "starts with":
        return (
          <input
            placeholder='website.com'
            value={startsWith}
            onChange={(event) =>
              onInputChange("startsWith", event.target.value)
            }
          />
        );
      default:
        throw new Error(`No case for operator ${operator}`);
    }
  };

  //Update option state to new option when option changes
  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    const newOption = options.find((option) => option.value === selectedValue);
    setOption(newOption);
  };

  //Update option state to new option when option changes
  const handleOperatorChange = (value) => {
    const newOperator = operators.find((operator) => operator.value === value);
    setOperator(newOperator);
  };

  //Update operators state when option changes
  useEffect(() => {
    setOperators(option.type === "string" ? stringOperators : numberOperators);
  }, [option]);

  //Update operator state when operators changes
  useEffect(() => {
    setOperator(operators[0]);
  }, [operators]);

  //Update query statement when query inputs change
  useEffect(() => {
    setQueryStatement(buildQueryStatement());
  }, [queryInputs, option, operator]);

  //Pass query statement up to app.js when the statement changes
  useEffect(() => {
    getSqlStatement(queryStatement, id);
  }, [queryStatement]);

  useEffect(() => {
    return () => {
      removeSqlStatement(id);
    };
  }, []);

  //Build our UI
  return (
    <div className='row'>
      <span className='removeButton' onClick={() => handleDeleteButton(id)}>
        <FaTimes />
      </span>
      <select className='row-options' onChange={handleOptionChange}>
        {optionsList}
      </select>
      {operator.value === "between" ? <span className='is'>is</span> : ""}
      <select
        className='row-operators'
        onChange={(event) => handleOperatorChange(event.target.value)}
      >
        {operatorsList}
      </select>
      {operatorTemplate()}
    </div>
  );
}

export default Row;
