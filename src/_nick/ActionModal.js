import React from 'react'
import './ActionModal.css'
import { log, doApexAction } from './_nick/Util/Util.js'

const ActionModal = ({ viewMap }) => {
  function fetchActions(actionName) {
    doApexAction('ReactController.getActions', actionName, processFetchResults)
  }
  function getActions(e) {
    if (e.target.value.length > 2) {
      disperseActions()
      fetchActions(e.target.value)
    }
  }
  function processFetchResults(results) {
    const viewResults = document.getElementById('action-results')
    for (let i = 0; i < results.length; i++) {
      const p = document.createElement('P')
      const textNode = document.createTextNode(results[i]['Name'])
      p.appendChild(textNode)
      p.className = 'action-name'
      p.dataset.recordid = results[i]['Id']
      p.addEventListener('click', handleActionClick)
      viewResults.appendChild(p)
    }
  }
  function disperseActions() {
    const resultsToDisperse = document.querySelectorAll('.action-name')
    if (resultsToDisperse && resultsToDisperse.length > 0) {
      for (let x = 0; x < resultsToDisperse.length; x++) {
        resultsToDisperse[x].remove()
      }
    }
  }
  function handleActionClick(e) {
    const input = document.getElementById('action_input')
    input.value = e.target.textContent
    const i = document.getElementById('action-results')
    i.dataset.selectedrecordid = e.target.dataset.recordid
    disperseActions()
  }
  function save() {
    const input = document.getElementById('action_input')
    const saveaction = viewMap['saveaction']
    saveaction({
      info: {
        name: input.value,
        type: 'sequence action',
        id: viewMap['info']['id'],
        element: input,
      },
    })
    document.getElementById('action_input').value = ''
  }
  function handleTypeSelection(e) {
    e.target.dataset.isSelected = true
  }

  function getContent() {
    const inputValue = viewMap['info']['name'] ? viewMap['info']['name'] : 'fuggit'
    if (viewMap == undefined || !viewMap) viewMap = { info: { name: '' } }
    return (
      <div>
        <p
          className="type-header"
          style={{
            marginTop: '-5px',
          }}
        >
          Type Action
        </p>
        <div className="types">
          <p className="type" isselected="false" onClick={handleTypeSelection}>
            Call
          </p>
          <p className="type" isselected="false" onClick={handleTypeSelection}>
            Email
          </p>
          <p className="type" isselected="false" onClick={handleTypeSelection}>
            SMS
          </p>
          <p className="type" isselected="false" onClick={handleTypeSelection}>
            Task
          </p>
        </div>
        <form>
          <div>
            <label>
              Select Action <br />
              <input
                type="text"
                onKeyUp={getActions}
                name={viewMap['info']['id'] ? viewMap['info']['id'] : ''}
                id="action_input"
              />
              <div id="action-results" selectedrecordid="" className="action-result-panel"></div>
            </label>
          </div>
          <div>
            <label>
              Execution Time <br />
              <input type="text" name="time" />
            </label>
          </div>
          <div>
            <label>
              Field Updates <br />
              <input type="radio" /> No Field Updates
              <br />
              <input type="radio" /> Field Updates Required
              <br />
            </label>
          </div>
          <div>
            <label>
              Criteria <br />
              <input type="radio" /> No Additional Criteria
              <br />
              <input type="radio" /> Conditions are met
              <br />
            </label>
          </div>
          <div style={{ display: 'flex', height: '40px', width: '70px' }}>
            {/* <button style={{border: "none", borderRadius: "2%"}}><p style={{color: "grey", fontSize: "10px"}}>Cancel</p></button> */}
            <p style={{ color: 'grey', marginLeft: '5px', fontSize: '10px' }}>Cancel</p>
            {/* <button onClick={saveaction} style={{backgroundColor: "lightgreen",borderRadius: "2%"}}><p style={{fontSize: "10px"}}>Save</p></button> */}
            <p onClick={() => save()} style={{ fontSize: '10px', marginLeft: '5px' }}>
              Save
            </p>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="outer-container">
      <p>Add an Action</p>
      <div className="action-types">{getContent()}</div>
    </div>
  )
}
export default ActionModal
