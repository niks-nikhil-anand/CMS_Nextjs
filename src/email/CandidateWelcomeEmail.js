import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';


function CandidateWelcomeEmail({ fullName, email, password, managerName }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Welcome to the Program - Candidate Account Details</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>
        Welcome {fullName}! Your candidate account has been created under {managerName}
      </Preview>

      <Section style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Row style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px' }}>
          <Heading as="h2" style={{ color: '#333' }}>
            Welcome, {fullName}!
          </Heading>

          <Text style={{ fontSize: '16px', color: '#555' }}>
            We’re excited to have you onboard as a candidate under <strong>{managerName}</strong>. 
            Our mission is to empower you with the right tools and support to grow your career.
          </Text>

          <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
            Here are your login credentials:
          </Text>

          <Text style={{ fontSize: '16px', color: '#333' }}>
            <strong>Email:</strong> {email}<br />
            <strong>Password:</strong> {password}
          </Text>

          <Text style={{ fontSize: '16px', color: '#f00', marginTop: '10px' }}>
            Please change your password after your first login for security purposes.
          </Text>

          <Button
            href="https://your-app-domain.com/login"
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
            }}
          >
            Go to Login
          </Button>

          <Text style={{ fontSize: '16px', color: '#555', marginTop: '30px' }}>
            We are committed to helping you succeed. Stay engaged, ask questions, and take full advantage of the opportunities ahead.
          </Text>

          <Text style={{ fontSize: '16px', color: '#555', marginTop: '20px' }}>
            Best wishes,<br />
            The Team
          </Text>

          <Text style={{ fontSize: '12px', color: '#999', marginTop: '30px' }}>
            <strong>Disclaimer:</strong> This email contains sensitive login credentials. Please do not share your password with anyone. 
            If you believe this email was sent to you by mistake, please contact support immediately.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

export default CandidateWelcomeEmail;
