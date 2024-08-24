import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Field, Input } from '@/components/common'
import { errorMessages } from '@/constants/errorMessage'
import { AddActivityReqDto, DayCategoryEnum, DaysTabEnum } from '@/types/plan'
import { cn } from '@/utils/cn'

import CategoryList from './CategoryList'
import ExpenseInput from './ExpenseInput'
import LocationInput from './LocationInput'

type Props = {
  currentTab: DaysTabEnum
  defaultValues?: AddActivityReqDto
  handleCancel: () => void
  handleSave: (payload: AddActivityReqDto) => void
}

const initialValues: AddActivityReqDto = {
  activityName: '',
  detail: '',
  activityLocation: '',
  activityExpenses: null,
  category: '',
}

function ActivityForm({
  currentTab,
  defaultValues,
  handleCancel,
  handleSave,
}: Props) {
  const [activityPayload, setActivityPayload] = useState<AddActivityReqDto>(
    defaultValues || initialValues
  )
  const {
    register,
    formState: { errors, isDirty },
  } = useForm<Partial<AddActivityReqDto>>({
    defaultValues: defaultValues || initialValues,
    mode: 'onChange',
  })

  const isValid = useMemo(
    () =>
      defaultValues
        ? !errors.activityName && !!activityPayload.category
        : !errors.activityName && !!activityPayload.category && isDirty,
    [errors, activityPayload.category, isDirty]
  )
  const updatePayload = (value: Partial<AddActivityReqDto>) => {
    setActivityPayload({
      ...activityPayload,
      ...value,
    })
  }

  return (
    <form className="rounded-md border border-gray-300 p-4">
      <Field
        name="카테고리"
        value={
          <CategoryList
            currentTab={currentTab}
            selectedCategory={activityPayload.category as DayCategoryEnum}
            onClick={(category) => updatePayload({ category })}
          />
        }
        isRequired
      />
      <Field
        name="활동명"
        value={
          <Input
            {...register('activityName', {
              required: {
                value: true,
                message: errorMessages.addActivity.nameRequired,
              },
              minLength: {
                value: 1,
                message: errorMessages.addActivity.nameRequired,
              },
              maxLength: {
                value: 15,
                message: errorMessages.addActivity.nameMaxLength,
              },
              value: activityPayload.activityName,
              onChange: (e) => updatePayload({ activityName: e.target.value }),
            })}
            type="text"
            className="p-2 text-sm"
            placeholder="활동명을 입력해주세요"
            errorMessage={errors.activityName && errors.activityName.message}
          />
        }
        isRequired
      />
      <Field
        name="장소"
        value={
          <LocationInput
            defaultValue={activityPayload.activityLocation}
            updatePayload={updatePayload}
          />
        }
      />
      <Field
        name="메모"
        value={
          <textarea
            {...register('detail', {
              value: activityPayload.detail,
              onChange: (e) => updatePayload({ detail: e.target.value }),
            })}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        }
      />
      <Field name="경비" value={<ExpenseInput />} />

      <div className="mt-2 flex items-center gap-x-3">
        <Button
          type="button"
          className="border border-blue-500 bg-transparent px-0 py-2 text-sm text-blue-500"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button
          type="button"
          isDisabled={!isValid}
          className={cn([
            isValid ? 'border border-blue-500' : 'border border-gray-400',
            'px-0 py-2 text-sm',
          ])}
          onClick={() => handleSave(activityPayload)}
        >
          저장
        </Button>
      </div>
    </form>
  )
}

export default ActivityForm
