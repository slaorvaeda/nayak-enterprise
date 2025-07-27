"use client";
import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateLedgerPDF } from "@/components/admin/LedgerPDF";

export default function AdminLedgerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(null); // payment object or null
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: '', notes: '', type: 'debit' });
  const [addingPayment, setAddingPayment] = useState(false);
  const [addPaymentError, setAddPaymentError] = useState(null);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/admin/customers");
        setCustomers(res.data.data.customers || []);
      } catch (err) {
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  async function handleViewLedger(customer) {
    setSelectedCustomer(customer);
    setLedgerLoading(true);
    setLedger(null);
    try {
      const [ordersRes, paymentsRes] = await Promise.all([
        axios.get(`/admin/customers/${customer._id}/orders`),
        axios.get(`/admin/customers/${customer._id}/payments`),
      ]);
      setLedger({
        orders: ordersRes.data.data.orders || [],
        payments: paymentsRes.data.data.payments || [],
      });
    } catch (err) {
      setLedger({ orders: [], payments: [], error: "Failed to load ledger" });
    } finally {
      setLedgerLoading(false);
    }
  }

  // Combine orders and payments into a single timeline
  function getTimeline(orders, payments) {
    const txs = [
      ...orders.map((o) => ({
        _id: o._id,
        date: o.orderDate,
        type: "credit",
        label: `Order #${o.orderNumber}`,
        amount: o.total ?? 0,
        status: o.status,
        notes: o.customerNotes || "",
        isOrder: true
      })),
      ...payments.map((p) => ({
        _id: p._id,
        date: p.date,
        type: p.type || "debit", // allow for manual credit
        label: p.type === "credit" ? (p.notes ? `Credit (${p.notes})` : "Credit") : (p.method ? `Payment (${p.method})` : "Payment"),
        amount: p.amount ?? 0,
        status: p.status,
        notes: p.notes || "",
        isOrder: false,
        payment: p
      }))
    ];
    return txs.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Add Payment or Credit
  async function handleAddPayment(e) {
    e.preventDefault();
    setAddingPayment(true);
    setAddPaymentError(null);
    try {
      await axios.post(`/admin/customers/${selectedCustomer._id}/payments`, {
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        notes: paymentForm.notes,
        type: paymentForm.type
      });
      setShowAddPayment(false);
      setPaymentForm({ amount: '', method: '', notes: '', type: 'debit' });
      // Refresh ledger
      handleViewLedger(selectedCustomer);
    } catch (err) {
      setAddPaymentError("Failed to add entry");
    } finally {
      setAddingPayment(false);
    }
  }

  // Edit Payment/Credit
  async function handleEditPayment(e) {
    e.preventDefault();
    setAddingPayment(true);
    setAddPaymentError(null);
    try {
      await axios.put(`/admin/customers/${selectedCustomer._id}/payments/${showEditPayment._id}`, {
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        notes: paymentForm.notes,
        type: paymentForm.type
      });
      setShowEditPayment(null);
      setPaymentForm({ amount: '', method: '', notes: '', type: 'debit' });
      handleViewLedger(selectedCustomer);
    } catch (err) {
      setAddPaymentError("Failed to update entry");
    } finally {
      setAddingPayment(false);
    }
  }

  // Delete Payment/Credit
  async function handleDeletePayment(payment) {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`/admin/customers/${selectedCustomer._id}/payments/${payment._id}`);
      handleViewLedger(selectedCustomer);
    } catch (err) {
      alert("Failed to delete entry");
    }
  }

  // PDF generation now uses LedgerPDF component
  function handleDownloadLedger() {
    generateLedgerPDF({ customer: selectedCustomer, ledger, getTimeline });
  }

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Ledger</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading customers...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>{customer.businessName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleViewLedger(customer)}>
                        View Ledger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ledger for {selectedCustomer.businessName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => { setShowAddPayment(true); setPaymentForm({ amount: '', method: '', notes: '', type: 'debit' }); }}>
                Add Payment
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setShowAddPayment(true); setPaymentForm({ amount: '', method: '', notes: '', type: 'credit' }); }}>
                Add Credit
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDownloadLedger}>
                Download Ledger
              </Button>
            </div>
            {(showAddPayment || showEditPayment) && (
              <form className="mb-6 space-y-2 bg-gray-50 p-4 rounded dark:bg-gray-900" onSubmit={showEditPayment ? handleEditPayment : handleAddPayment}>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Amount"
                    className="border rounded px-2 py-1 flex-1 bg-background placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Method (e.g. Cash, UPI)"
                    className="border rounded px-2 py-1 flex-1 bg-background placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                    value={paymentForm.method}
                    onChange={e => setPaymentForm(f => ({ ...f, method: e.target.value }))}
                  />
                  <select
                    className="border rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                    value={paymentForm.type}
                    onChange={e => setPaymentForm(f => ({ ...f, type: e.target.value }))}
                  >
                    <option value="debit">Payment (Debit)</option>
                    <option value="credit">Credit (Manual)</option>
                  </select>
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  className="border rounded px-2 py-1 w-full bg-background placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm(f => ({ ...f, notes: e.target.value }))}
                />
                <div className="flex gap-2 items-center flex-wrap">
                  <Button size="sm" type="submit" disabled={addingPayment}>
                    {addingPayment ? (showEditPayment ? "Saving..." : "Adding...") : (showEditPayment ? "Save" : "Add Entry")}
                  </Button>
                  <Button size="sm" type="button" variant="outline" onClick={() => { setShowAddPayment(false); setShowEditPayment(null); }}>
                    Cancel
                  </Button>
                  {addPaymentError && <span className="text-red-500 ml-2">{addPaymentError}</span>}
                </div>
              </form>
            )}
            <div className="overflow-x-auto">
            {ledgerLoading ? (
              <div>Loading ledger...</div>
            ) : ledger?.error ? (
              <div className="text-red-500">{ledger.error}</div>
            ) : ledger ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-semibold mb-2">Ledger Timeline</h2>
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        let balance = 0;
                        return getTimeline(ledger.orders, ledger.payments).map((tx, idx) => {
                          if (tx.type === "credit") {
                            balance += tx.amount;
                          } else {
                            balance -= tx.amount;
                          }
                          return (
                            <TableRow key={tx._id}>
                              <TableCell>{tx.date ? new Date(tx.date).toLocaleDateString() : "-"}</TableCell>
                              <TableCell>{tx.label}</TableCell>
                              <TableCell>{tx.type === "credit" ? `Rs. ${tx.amount.toLocaleString()}` : ""}</TableCell>
                              <TableCell>{tx.type === "debit" ? `Rs. ${tx.amount.toLocaleString()}` : ""}</TableCell>
                              <TableCell>{`Rs. ${balance.toLocaleString()}`}</TableCell>
                              <TableCell>{tx.notes}</TableCell>
                              <TableCell>
                                {!tx.isOrder && (
                                  <>
                                    <Button size="xs" variant="outline" onClick={() => {
                                      setShowEditPayment(tx.payment);
                                      setPaymentForm({
                                        amount: tx.amount,
                                        method: tx.payment.method,
                                        notes: tx.notes,
                                        type: tx.type
                                      });
                                    }}>
                                      Edit
                                    </Button>
                                    <Button size="xs" variant="destructive" className="ml-2" onClick={() => handleDeletePayment(tx.payment)}>
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        });
                      })()}
                    </TableBody>
                  </Table>
                </div>
                <div className="font-bold text-lg mt-4">
                  Final Balance: Rs. {(
                    ledger.orders.reduce((sum, o) => sum + (o.total ?? 0), 0) -
                    ledger.payments.reduce((sum, p) => sum + (p.amount ?? 0), 0)
                  ).toLocaleString()}
                </div>
              </div>
            ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 