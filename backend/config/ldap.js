//config/ldap.js
import passport from 'passport';
import LdapStrategy from 'passport-ldapauth';

const ldapOptions = {
  server: {
    url: 'ldap://10.189.87.7:389',
    bindDN: 'cn=script,ou=Funcionarios,ou=Usuarios123,dc=educ123,dc=sp,dc=senai,dc=br',
    bindCredentials: '7GFGOy4ATCiqW9c86eStgCe0RA9BgA',
    searchBase: 'ou=Funcionarios,ou=Usuarios123,dc=educ123,dc=sp,dc=senai,dc=br',
    searchFilter: '(sAMAccountName={{username}})'
  }
};

passport.use(new LdapStrategy(ldapOptions, (user, done) => {
  if (!user) {
    return done(null, false, { message: 'Usuário não encontrado' });
  }
  return done(null, user);
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
