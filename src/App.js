import "./App.css";
import Row from "./Components/Row/Row";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

function App() {
  //Set state for rows (array of row components)
  const [rows, setRows] = useState([]);
  //Set state for current sql statement
  const [currentSqlStatement, setCurrentSqlStatement] = useState({});
  //Set state for each sql statement we will receive from each row
  const [rowStatements, setRowStatements] = useState({});
  //set State for statement ID (when we get the current statement from row)
  const [statementId, setStatementId] = useState(0);
  //Set state for the final sqlStatement
  const [sqlStatement, setSqlStatement] = useState("");
  //Set state for the statement string we will use to populate the SQL Div after clicking the search button
  const [sqlStatementString, SqlStatementString] = useState("");
  //Set id for the current row (use this to identify the row we want to delete)
  const [currentRowId, setCurrentRowId] = useState(null);

  //Abstracting the process of creating a new row
  function newRow() {
    return (
      <Row
        key={Math.random() * 1000}
        id={Math.random() * 1000}
        handleDeleteButton={handleDeleteButton}
        getSqlStatement={getSqlStatement}
        removeSqlStatement={removeSqlStatement}
      />
    );
  }

  //Initialize rows at after component gets mounted
  useEffect(() => initializeRows(), []);

  //Function that resets/initializes sqlStatements state
  function initializeSqlStatements() {
    setRowStatements({});
  }

  //Function that resets/initializes rows state
  function initializeRows() {
    setRows([newRow()]);
  }

  //Function for handling when 'and' button is clicked
  function handleAndButton() {
    setRows([...rows, newRow()]);
  }

  //Function for handling when search button is clicked (here we add the sql statement to the DOM)
  function handleSearchButton() {
    SqlStatementString(sqlStatement);
  }

  //Function for handling when the 'x' is clicked on a row to remove it (remove row in useEffects below)
  function handleDeleteButton(id) {
    setCurrentRowId(id);
  }

  useEffect(() => {
    if (rows.length > 1) {
      const filteredRows = rows.filter((row) => row.props.id !== currentRowId);
      setRows([...filteredRows]);
    } else {
      initializeRows();
    }
  }, [currentRowId]);

  //Function for getting the the sql statement from row when row inputs, options, or operator changes (add sql statement in useEffects below)
  function getSqlStatement(value, id) {
    setCurrentSqlStatement({ id, value });
  }

  useEffect(() => {
    if (currentSqlStatement.id) {
      setRowStatements({
        ...rowStatements,
        [currentSqlStatement.id]: currentSqlStatement.value,
      });
    }
  }, [currentSqlStatement]);

  //Function for getting the the sql statement from row when row inputs, options, or operator changes
  function removeSqlStatement(id) {
    setStatementId(id);
  }

  //Function for adding each sql statement to our sqlStatements object after we receive a new statement
  useEffect(() => {
    if (rowStatements) {
      const rowStatementsArray = Object.values(rowStatements);
      const statement = rowStatementsArray.reduce(
        (finalStatement, rowStatement) => {
          return finalStatement + rowStatement + " AND ";
        },
        ""
      );

      const tempStatement = `SELECT * FROM session WHERE ${statement}`;
      const finalStatement = tempStatement.substring(
        0,
        tempStatement.length - 4
      );
      setSqlStatement(finalStatement);
    }
  }, [rowStatements]);

  //Function for deleting sql statement from sqlStatements object when a row gets deleted
  useEffect(() => {
    const filteredStatements = { ...rowStatements };
    delete filteredStatements[currentRowId];
    setRowStatements({ ...filteredStatements });
  }, [statementId]);

  //Build our main component's UI
  return (
    <div className='app'>
      <span className='app-header'>Search for Sessions</span>
      {rows}
      <button className='app-buttonAnd' onClick={handleAndButton}>
        And
      </button>
      <span className='app-horizontalLine' />
      <div className='app-buttonContainer'>
        <button className='app-buttonSearch' onClick={handleSearchButton}>
          <span className='app-buttonSearch__icon'>
            <FaSearch />
          </span>
          Search
        </button>
        <button
          className='app-buttonReset'
          onClick={() => {
            initializeRows();
            initializeSqlStatements();
          }}
        >
          Reset
        </button>
      </div>
      <div className='app-sql'>
        <span>Your Generated SQL Statement goes here:</span>
        <p>{sqlStatementString}</p>
      </div>
    </div>
  );
}

export default App;
