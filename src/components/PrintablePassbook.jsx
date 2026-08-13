import React from 'react';
import PropTypes from 'prop-types';
import { formatINR } from '../utils/moneyUtils';

/**
 * Clean Print-Only Passbook Statement View.
 * Displayed exclusively during browser print (window.print()).
 */
export const PrintablePassbook = ({ statementData }) => {
  if (!statementData) return null;

  const {
    accountHolder,
    accountNo,
    ifscCode,
    upiId,
    periodLabel,
    generatedDateStr,
    openingBalance,
    totalCredits,
    totalDebits,
    closingBalance,
    transactions
  } = statementData;

  return (
    <div id="vault-printable-statement" className="hidden print:block bg-white text-black p-8 font-sans select-text">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-black pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-bold font-serif text-xs">
              V
            </div>
            <h1 className="text-xl font-bold tracking-tight text-black font-sans">
              VAULT
            </h1>
          </div>
          <p className="text-xs text-gray-700 font-mono">
            DIGITAL BANKING • OFFICIAL PASSBOOK STATEMENT
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-base font-bold text-black uppercase font-sans">
            ACCOUNT STATEMENT
          </h2>
          <p className="text-xs text-gray-700 font-mono">
            Generated: {generatedDateStr}
          </p>
        </div>
      </div>

      {/* Account Metadata Grid */}
      <div className="grid grid-cols-2 gap-6 text-xs font-mono mb-6">
        <div className="space-y-1">
          <p className="font-bold text-black uppercase border-b border-gray-300 pb-1 mb-2">
            ACCOUNT DETAILS
          </p>
          <p><span className="text-gray-600">Account Holder:</span> <strong>{accountHolder}</strong></p>
          <p><span className="text-gray-600">Account Number:</span> <strong>{accountNo}</strong></p>
          <p><span className="text-gray-600">IFSC Code:</span> <strong>{ifscCode}</strong></p>
          <p><span className="text-gray-600">UPI Handle:</span> <strong>{upiId}</strong></p>
        </div>

        <div className="space-y-1">
          <p className="font-bold text-black uppercase border-b border-gray-300 pb-1 mb-2">
            STATEMENT PERIOD
          </p>
          <p><span className="text-gray-600">Period:</span> <strong>{periodLabel}</strong></p>
          <p><span className="text-gray-600">Account Type:</span> <strong>VAULT Primary Savings</strong></p>
          <p><span className="text-gray-600">Currency:</span> <strong>INR (₹)</strong></p>
        </div>
      </div>

      {/* Statement Summary Box */}
      <div className="border border-black p-3 mb-6 grid grid-cols-4 gap-2 text-xs font-mono text-center bg-gray-50">
        <div>
          <span className="text-[10px] text-gray-600 uppercase font-bold block">OPENING BAL</span>
          <strong className="text-xs text-black">{formatINR(openingBalance)}</strong>
        </div>

        <div className="border-l border-gray-300">
          <span className="text-[10px] text-gray-600 uppercase font-bold block">TOTAL CREDITS</span>
          <strong className="text-xs text-green-700">+{formatINR(totalCredits)}</strong>
        </div>

        <div className="border-l border-gray-300">
          <span className="text-[10px] text-gray-600 uppercase font-bold block">TOTAL DEBITS</span>
          <strong className="text-xs text-red-700">-{formatINR(totalDebits)}</strong>
        </div>

        <div className="border-l border-gray-300">
          <span className="text-[10px] text-gray-600 uppercase font-bold block">CLOSING BAL</span>
          <strong className="text-xs text-black">{formatINR(closingBalance)}</strong>
        </div>
      </div>

      {/* Transaction Table */}
      <table className="w-full text-left text-xs font-mono border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-400 font-bold">
            <th className="p-2 border-r border-gray-300">DATE</th>
            <th className="p-2 border-r border-gray-300">DESCRIPTION</th>
            <th className="p-2 border-r border-gray-300">CATEGORY</th>
            <th className="p-2 border-r border-gray-300">REFERENCE ID</th>
            <th className="p-2 text-right border-r border-gray-300">DEBIT</th>
            <th className="p-2 text-right border-r border-gray-300">CREDIT</th>
            <th className="p-2 text-right">BALANCE</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map(t => {
              const isCredit = t.type === 'credit' || t.type === 'refund';
              return (
                <tr key={t.id} className="border-b border-gray-200">
                  <td className="p-2 border-r border-gray-200 whitespace-nowrap">{t.date}</td>
                  <td className="p-2 border-r border-gray-200 font-sans font-medium">{t.merchant}</td>
                  <td className="p-2 border-r border-gray-200 text-gray-700">{t.category}</td>
                  <td className="p-2 border-r border-gray-200 font-mono text-[11px]">{t.upiRef || t.id}</td>
                  <td className="p-2 text-right border-r border-gray-200 text-red-700">
                    {!isCredit ? `-${formatINR(t.amount)}` : '—'}
                  </td>
                  <td className="p-2 text-right border-r border-gray-200 text-green-700">
                    {isCredit ? `+${formatINR(t.amount)}` : '—'}
                  </td>
                  <td className="p-2 text-right font-bold">
                    {formatINR(t.runningBalance || 0)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500 italic">
                No transactions recorded for the selected statement period.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-4 flex justify-between items-center text-[10px] font-mono text-gray-600">
        <span>Generated by VAULT Digital Banking • Official Statement</span>
        <span>End of Statement</span>
      </div>
    </div>
  );
};

PrintablePassbook.propTypes = {
  statementData: PropTypes.object
};
