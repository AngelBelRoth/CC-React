import axios from 'axios'
import { useEffect, useState } from 'react'

const AdminPage = () => {
    const [users, setUsers] = useState([])

    const getAllUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/business-type", {
                params: { business: "all" }
            });
            console.log(res.data);
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const approveUser = async (id) => {
        try {
            const res = await axios.put("http://localhost:8080/updateUserStatus", {
                params: { userId: id, status: "approved" }
            });
            console.log(res.data)
            if (!res.data.success)
                return;
            setUsers(prev =>
                prev.map(user =>
                    user.user_id === id
                        ? { ...user, status: "approved" }
                        : user
                )
            );
        } catch {
            console.log("Error approving user");
        }
    };

    const rejectUser = async (id) => {
        try {
            const res = await axios.put("http://localhost:8080/updateUserStatus", {
                params: { userId: id, status: "rejected" }
            });
            if (!res.data.success)
                return;
            setUsers(prev =>
                prev.map(user =>
                    user.user_id === id
                        ? { ...user, status: "rejected" }
                        : user
                )
            );
        } catch {
            console.log("Error rejecting user");
        }
    };


    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            {users.map((user) => (
                <div
                    key={user.user_id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "16px",
                        margin: "12px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        background: "#fff",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        width: "95%"
                    }}
                >
                    <div>
                        <p style={{ margin: 0 }}><strong>Email:</strong> {user.email}</p>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        {user.status !== "approved" && (
                            <button
                                style={{
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    padding: "8px 14px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    width: "100px"
                                }}
                                onClick={() => approveUser(user.user_id)}
                            >
                                Approve
                            </button>
                        )}

                        {user.status === "approved" && (
                            <button
                                style={{
                                    backgroundColor: "#E53935",
                                    color: "white",
                                    padding: "8px 14px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    width: "100px"
                                }}
                                onClick={() => rejectUser(user.user_id)}
                            >
                                Reject
                            </button>
                        )}
                    </div>

                </div>
            ))}

        </div>
    );
};

export default AdminPage;