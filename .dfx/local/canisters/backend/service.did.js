export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'kaspaAddress' : IDL.Func([], [IDL.Text], []),
    'sign' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [IDL.Record({ 'signature' : IDL.Vec(IDL.Nat8) })],
        [],
      ),
    'suiAddress' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
