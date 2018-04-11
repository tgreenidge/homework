// add person
// if person already in list, do not add
// only sunbit if form is valid

// add button adds to the list
// submit button adds household list to debug

// stores all the members of the household
var householdMembers = [];

var addButton = document.getElementsByClassName('add')[0];

var submitButton = document.getElementsByTagName('button')[1];

var householdList = document.getElementsByTagName('ol')[0];

// returns true if input is > 0
function isAgeValid(age) {
  return parseInt(age) > 0;
}

// returns true if the input is not an empty string
function isRelationshipPresent(rel) {
  return rel !== '';
}

// adds a person to a household
function addToHousehold(age, relationship, smoker) {
  var person = {};
  person.age = age;
  person.relationship = relationship;
  person.smoker = smoker;

  householdMembers.push(person);

  printNewMember(person);
}

// displays newly added member to the DOM
function printNewMember(member) {
  var li = document.createElement('li');

  var removeButton = document.createElement('button');
  removeButton.setAttribute('class', 'remove');
  removeButton.innerText = 'remove';

  // add event listener to this button created
  addEventListenerToRemoveButton(removeButton);

  var smoker = member.smoker === true ? 'Yes' : 'No';
  var memberInfo =
    member.relationship.toUpperCase() +
    ' - Age: ' +
    member.age +
    ', Smoker: ' +
    smoker +
    ' ';

  var text = document.createTextNode(memberInfo);
  li.appendChild(text);
  li.appendChild(removeButton);
  householdList.appendChild(li);
}

// removes a member from the householdMembers array
function removeMember(memberIndex) {
  householdMembers.splice(memberIndex, 1);
}

function printErrorMessage(message) {
  if (document.getElementsByClassName('message').length > 0) {
    //replace Error Message;
    document.getElementsByClassName('message')[0].innerHTML = message;
  } else {
    //create div for message
    var messageBox = document.createElement('div');
    var messageText = document.createTextNode(message);

    messageBox.setAttribute('class', 'message');
    messageBox.style.color = 'red';
    messageBox.appendChild(messageText);

    var body = document.getElementsByTagName('body')[0];

    var builderSection = document.getElementsByClassName('builder')[0];

    //insert message text right before the form
    body.insertBefore(messageBox, builderSection);
  }
}

function addEventListenerToRemoveButton(button) {
  button.addEventListener('click', function(e) {
    e.preventDefault();

    // gets index of li to be removed, as well as index in household members to be removed
    var indexOfMember = Array.prototype.indexOf.call(
      this.parentNode.parentNode.childNodes,
      this.parentNode
    );

    householdList.removeChild(householdList.childNodes[indexOfMember]);
    removeMember(indexOfMember);
  });
}

// adds an event listener to the 'add' button and if valid form input, adds a member to householdMembers array
addButton.addEventListener('click', function(e) {
  e.preventDefault();

  var age = document.getElementsByName('age')[0].value;
  var relationship = document.getElementsByName('rel')[0].value;
  var smoker = document.getElementsByName('smoker')[0].checked;

  if (isAgeValid(age) && isRelationshipPresent(relationship)) {
    addToHousehold(parseInt(age), relationship, smoker);
  } else if (!isAgeValid(age) && !isRelationshipPresent(relationship)) {
    printErrorMessage(
      'Please enter a valid age.\nPlease enter a the relationship to new member'
    );
  } else if (!isAgeValid(age)) {
    printErrorMessage('Please enter a valid age');
  } else {
    printErrorMessage('Please enter a the relationship to new member');
  }
});

// adds an event listener to the submit button and submits household members to the debug section
submitButton.addEventListener('click', function(e) {
  e.preventDefault();

  // serialize json
  var serializedResult = JSON.stringify(householdMembers);

  if (!householdMembers.length) {
    printErrorMessage(
      'No members added to household. Please use form to add new members.'
    );
  }

  // add to debug element on DOM
  var debug = document.getElementsByClassName('debug')[0];
  debug.innerText = serializedResult;

  // show debug element
  debug.style.display = 'inline-block';
});
