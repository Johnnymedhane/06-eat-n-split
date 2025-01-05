import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
const [friends, setFriends] = useState(initialFriends);
const [selectFriend, setSelectFriend] = useState(null);

  function addFriend(){
    setShowAddFriend((show) => !show)

  }
  function handlAddFriend(newFriend){
    setFriends(friend => [...friend, newFriend]);
    setShowAddFriend(false);
  }

  function handlSelection(friend) {
    setSelectFriend(selected => selected?.id === friend.id ?
       null : friend);
       setShowAddFriend(false);
  } 

  function handlSplitBillSumit(value){
    console.log(value);
    setFriends(friend => friend.map(friend => friend.id === selectFriend.id ?
       {...friend, balance: friend.balance + value}: friend));
 
       setSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar"> 
    <FriendsList list={friends}  onSelection ={handlSelection} selectedFriend={selectFriend}/>
   {showAddFriend && <FormAddFriend onAddFriend={handlAddFriend}  />}
    <Button  onClick={addFriend}>{showAddFriend ? "Close": "Add Friend"}</Button>
    </div>
   {selectFriend && <FormSplitBill selectedFriend ={selectFriend} onSplit={handlSplitBillSumit} />}
    
    </div>
  )

}

function Button({children, onClick}){
  return <button className="button" onClick={onClick}> {children} </button>
}

function FriendsList({list,  onSelection, selectedFriend}) {
  return (
  <ul> 
    {list.map(friend => <Friend key={friend.id}
     friend={friend}  onSelection ={onSelection} selectedFriend={selectedFriend}
   />)}
  </ul>
  )
}


function Friend({friend,  onSelection, selectedFriend}){
   const isSelected = selectedFriend?.id === friend.id;

  return (
  <li className={isSelected ? 'selected': ""}>
<img src={friend.image} alt={friend.name}/>
<h3>{friend.name}</h3>
{friend.balance < 0 &&
 <p className="red">  you owe {friend.name} {Math.abs(friend.balance)}$
</p>}
{friend.balance > 0 && 
<p className="green">{friend.name} owe you {Math.abs(friend.balance)}$
  </p>}
{friend.balance === 0 && 
<p>You and {friend.name} are even 
  </p>}
<Button onClick={()=> onSelection(friend)}>{isSelected ? "Close": "Select"}</Button>

  </li>
  )
}
function FormAddFriend({onAddFriend}){
 
  const[name, setName] = useState('')
  const[image, setImage] = useState('https://i.pravatar.cc/48');

  function handlSumit(e){
    e.preventDefault()

    if(!name || !image) return;
    const id = crypto.randomUUID()
    const newList = {id,
       name, 
       image:  `${image}?=${id}`, 
       balance: 0, }

       onAddFriend(newList);
      

    setName('');
    setImage('https://i.pravatar.cc/48');
  // closeForm(add => !add)
  }
return <form className="form-add-friend" onSubmit={handlSumit}>
  
    <label>🧑‍🤝‍🧑Friend name </label>  <input type="text" value={name} onChange={(e) => setName(e.target.value)}/> 
    <label>🌇Image URL</label>  <input type="text" 
    placeholder="https://i.pravatar.cc/48" value={image}onChange={(e) => setImage(e.target.value)}/> 
  
  <Button type="submit">Add</Button>
  </form>
}

function FormSplitBill({selectedFriend, onSplit}) {
  const[bill, setbill]= useState("");
  const [yourExpense, setyourExpense]= useState('');
  const [whoPay, setWhoPay]= useState('user')
  const friendExpense = bill ? bill - yourExpense: "";
  const adjustment = whoPay === 'user' ? yourExpense - friendExpense : friendExpense -yourExpense;

  function handleSumit(e){
    e.preventDefault();
  
  if(!bill || !yourExpense) return;
   onSplit(whoPay === "user" ? friendExpense : -yourExpense)

    setbill("");
    setyourExpense('');
  }
 

  return (
  <form className="form-split-bill" onSubmit={handleSumit}>
    <h2>Split bill with {selectedFriend.name}</h2>

    <label>💰 Bill value</label> 
    <input type="number"  value={bill} onChange={(e) => setbill(e.target.value)}/>

    <label>🧍Your expense</label> 
    <input type="number"  value={yourExpense} onChange={(e) => setyourExpense(Number(e.target.value)
       > bill ? yourExpense : Number(e.target.value))}/>

    <label>🧑‍🤝‍🧑{selectedFriend.name} expense</label> 
    <input type="number" max={100} value={friendExpense} disabled/>

    <label>🤑who is paying the bill?</label>
     <select value={whoPay} onChange={(e) =>setWhoPay(e.target.value)}>
      <option value="user">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
    <Button>split bill</Button>
  </form>
  );
}