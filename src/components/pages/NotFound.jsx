import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: '#110E18',
        width: '100%',
        minHeight: '80vh',
        borderRadius: '16px'
      }}
    >
      <Result
        status="403"
        title={<p style={{ color: '#FCFCFC' }}>403 - Not Found</p>}
        subTitle={<h3 style={{ color: '#FCFCFC' }}>Sorry, this page not exist.</h3>}
        extra={
          <Button onClick={() => navigate('/homepage')} type="primary">
            Back Home
          </Button>
        }
      />
    </div>
  );
}
