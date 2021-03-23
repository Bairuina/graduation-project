import React, { useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Select
} from 'antd'
import { serviceCreateCapitalFlowType, serviceUpdateCapitalFlowType } from '@/services'
import { TYPES } from '../../enum'
import useKeepState from 'use-keep-state'

type Props = {
  visible: boolean
  onSuccess: (res?: any) => void
  onCancel: () => void
  rowData: null | { [propName: string]: any }
}

const { Option } = Select
const initialState = {
  confirmLoading: false,
}

const CreateTask: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()

      const params = {
        type: values.type,
        name: values.name.trim()
      }

      setState({ confirmLoading: true });

      (rowData
        ? serviceUpdateCapitalFlowType(rowData.id, params)
          : serviceCreateCapitalFlowType(params)
      )
      .then(res => {
        if (res.data.success) {
          onSuccess(res.data.data)
        }
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (visible && rowData) {
      form.setFieldsValue({
        name: rowData.name,
        type: rowData.type
      })
    }
  }, [visible, rowData])

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }
  }, [visible])

  return (
    <Modal
      title="新增类别"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      forceRender
    >
      <Form form={form}>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入类别名称"
            }
          ]}
        >
          <Input
            maxLength={20}
            placeholder="请输入类别名称"
          />
        </Form.Item>
        <Form.Item
          label="类型"
          name="type"
          rules={[
            {
              required: true,
              message: "请选择类型"
            }
          ]}
        >
          <Select>
            {TYPES.map(item => (
              <Option value={item.value} key={item.value}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateTask)
