import * as iban from 'ibantools';
import { Modal, Form, Button, FormControl, FormGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
import axios from "axios";
import { banksInfoPath } from './routes';

type ModalProps = {
  show: boolean,
  onHide: any,
  fetched: object[],
  onSubmit: any,
};

const CustomModal = ({
  show,
  onHide,
  fetched,
  onSubmit,
}: ModalProps) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [postFailed, setPostFailed] = useState(false);
  const fields = Object.entries(fetched[0]).map(([key,]) => [key, '']);
  const initialValues = Object.fromEntries(fields);
  const getValidationObject = (fieldsToValidate: any[]) => fieldsToValidate
    .reduce((acc, [key, ]) => {
      switch (key) {
        case 'id':
          acc.id = yup.number().required().positive().integer();
          return acc;
        case 'email':
          acc.email = yup.string().required().email();
          return acc;
        case 'IBAN':
          acc.IBAN = yup.mixed().test({
            name: 'IBAN',
            exclusive: true,
            message: 'This IBAN is not valid',
            test: (value: string) => iban.isValidIBAN(value),
          });
          return acc;
        default:
          acc[key] = yup.string().required().min(3);
          return acc;
      }
    }, {});
  const validationObject = getValidationObject(fields);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: yup.object(validationObject),
    onSubmit: async (values) => {
      setSubmitting(true);
      setPostFailed(false);
      try {
        await axios.post(banksInfoPath(), values);
        await onSubmit();
      } catch (err) {
        if (err.isAxiosError && err.response.status === 500) {
          setSubmitting(false);
          setPostFailed(true);
          return;
        }
      }
      onHide();
    },
  });

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {fields.map(([key, ]) => (
            <FormGroup key={key}>
              <Form.Label htmlFor={key}>{key}</Form.Label>
              <Form.Control
                required
                id={key}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[key]}
                isInvalid={
                  formik.touched[key]
                  &&
                  (formik.errors.hasOwnProperty(key))}
                name={key}
              />
              <FormControl.Feedback
                type="invalid"
              >
                {formik.errors[key]}
              </FormControl.Feedback>
            </FormGroup>
          ))}
            {postFailed && (
              <div className="text-danger">ID is already taken</div>
            )}
          <Button
            type="submit"
            className="w-100 mb-3"
            disabled={isSubmitting}
            variant="outline-dark"
          >
            Send
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

export default CustomModal;
