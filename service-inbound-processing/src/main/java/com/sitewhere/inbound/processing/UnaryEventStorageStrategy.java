/*
 * Copyright (c) SiteWhere, LLC. All rights reserved. http://www.sitewhere.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */
package com.sitewhere.inbound.processing;

import com.sitewhere.grpc.client.event.BlockingDeviceEventManagement;
import com.sitewhere.grpc.client.spi.client.IDeviceEventManagementApiChannel;
import com.sitewhere.grpc.kafka.model.KafkaModel.GInboundEventPayload;
import com.sitewhere.grpc.model.DeviceEventModel.GAnyDeviceEventCreateRequest;
import com.sitewhere.grpc.model.converter.EventModelConverter;
import com.sitewhere.inbound.spi.microservice.IInboundEventStorageStrategy;
import com.sitewhere.inbound.spi.microservice.IInboundProcessingMicroservice;
import com.sitewhere.inbound.spi.microservice.IInboundProcessingTenantEngine;
import com.sitewhere.spi.SiteWhereException;
import com.sitewhere.spi.device.IDeviceAssignment;
import com.sitewhere.spi.device.IDeviceManagement;
import com.sitewhere.spi.device.event.request.IDeviceAlertCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceCommandInvocationCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceCommandResponseCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceEventCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceLocationCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceMeasurementsCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceStateChangeCreateRequest;
import com.sitewhere.spi.device.event.request.IDeviceStreamDataCreateRequest;
import com.sitewhere.spi.device.streaming.IDeviceStream;

/**
 * Event storage strategy that sends each event via a unary GRPC call.
 * 
 * @author Derek
 */
public class UnaryEventStorageStrategy implements IInboundEventStorageStrategy {

    /** Handle to inbound processing tenant engine */
    private IInboundProcessingTenantEngine tenantEngine;

    /** Get processing logic */
    private InboundPayloadProcessingLogic inboundPayloadProcessingLogic;

    public UnaryEventStorageStrategy(IInboundProcessingTenantEngine tenantEngine,
	    InboundPayloadProcessingLogic inboundPayloadProcessingLogic) {
	this.tenantEngine = tenantEngine;
	this.inboundPayloadProcessingLogic = inboundPayloadProcessingLogic;
    }

    /*
     * @see com.sitewhere.inbound.spi.microservice.IInboundEventStorageStrategy#
     * storeDeviceEvent(com.sitewhere.spi.device.IDeviceAssignment,
     * com.sitewhere.grpc.kafka.model.KafkaModel.GInboundEventPayload)
     */
    @Override
    public void storeDeviceEvent(IDeviceAssignment assignment, GInboundEventPayload payload) throws SiteWhereException {
	GAnyDeviceEventCreateRequest grpc = payload.getEvent();
	IDeviceEventCreateRequest request = EventModelConverter.asApiDeviceEventCreateRequest(grpc);
	switch (request.getEventType()) {
	case Measurements:
	    getDeviceEventManagement().addDeviceMeasurements(assignment.getId(),
		    (IDeviceMeasurementsCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case Alert:
	    getDeviceEventManagement().addDeviceAlert(assignment.getId(), (IDeviceAlertCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case CommandInvocation:
	    getDeviceEventManagement().addDeviceCommandInvocation(assignment.getId(),
		    (IDeviceCommandInvocationCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case CommandResponse:
	    getDeviceEventManagement().addDeviceCommandResponse(assignment.getId(),
		    (IDeviceCommandResponseCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case Location:
	    getDeviceEventManagement().addDeviceLocation(assignment.getId(), (IDeviceLocationCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case StateChange:
	    getDeviceEventManagement().addDeviceStateChange(assignment.getId(),
		    (IDeviceStateChangeCreateRequest) request,
		    new AlertHandlerStreamObserver<>(getInboundPayloadProcessingLogic()));
	    break;
	case StreamData: {
	    IDeviceStreamDataCreateRequest sdreq = (IDeviceStreamDataCreateRequest) request;
	    IDeviceStream stream = getDeviceManagement().getDeviceStream(assignment.getId(), sdreq.getStreamId());
	    if (stream != null) {
		new BlockingDeviceEventManagement(getDeviceEventManagement()).addDeviceStreamData(assignment.getId(),
			stream, sdreq);
	    } else {
		throw new SiteWhereException("Stream data references invalid stream: " + sdreq.getStreamId());
	    }
	    break;
	}
	default:
	    throw new SiteWhereException("Unknown event type sent for storage: " + request.getEventType().name());
	}
    }

    /**
     * Send alert payload via event management api.
     * 
     * @param assignment
     * @param request
     * @throws SiteWhereException
     */
    protected void sendAlert(IDeviceAssignment assignment, IDeviceAlertCreateRequest request)
	    throws SiteWhereException {
    }

    /**
     * Get device management implementation.
     * 
     * @return
     */
    protected IDeviceManagement getDeviceManagement() {
	return ((IInboundProcessingMicroservice) getTenantEngine().getMicroservice()).getDeviceManagementApiDemux()
		.getApiChannel();
    }

    /**
     * Get device event management implementation.
     * 
     * @return
     */
    protected IDeviceEventManagementApiChannel<?> getDeviceEventManagement() {
	return ((IInboundProcessingMicroservice) getTenantEngine().getMicroservice()).getDeviceEventManagementApiDemux()
		.getApiChannel();
    }

    protected IInboundProcessingTenantEngine getTenantEngine() {
	return tenantEngine;
    }

    protected void setTenantEngine(IInboundProcessingTenantEngine tenantEngine) {
	this.tenantEngine = tenantEngine;
    }

    protected InboundPayloadProcessingLogic getInboundPayloadProcessingLogic() {
	return inboundPayloadProcessingLogic;
    }

    protected void setInboundPayloadProcessingLogic(InboundPayloadProcessingLogic inboundPayloadProcessingLogic) {
	this.inboundPayloadProcessingLogic = inboundPayloadProcessingLogic;
    }
}